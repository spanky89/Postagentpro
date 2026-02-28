import express from 'express';
import { prisma } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import { generateCompletePost } from '../services/postGenerator.js';
import { getStockImage, getImageOptions } from '../services/imageService.js';

const router = express.Router();

// GET /api/posts - Get user's post queue
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    
    const where = {
      userId: req.user.userId
    };
    
    if (status) {
      where.status = status.toLowerCase();
    }
    
    const posts = await prisma.postQueue.findMany({
      where,
      orderBy: { scheduledFor: 'asc' },
      take: parseInt(limit),
      include: {
        account: {
          select: {
            platform: true,
            accountName: true
          }
        }
      }
    });
    
    res.json(posts);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/generate - Generate a new post
router.post('/generate', requireAuth, async (req, res, next) => {
  try {
    const { postType = 'general', includeImage = true } = req.body;
    
    // Get user's business profile
    const business = await prisma.business.findUnique({
      where: { userId: req.user.userId }
    });
    
    if (!business) {
      return res.status(400).json({ 
        error: 'Please complete your business profile first' 
      });
    }
    
    // Generate post content
    const postData = await generateCompletePost(business, postType);
    
    // Get stock image if requested
    let imageData = null;
    if (includeImage) {
      imageData = await getStockImage(business.type);
    }
    
    // Calculate next available schedule slot
    const scheduledFor = await getNextScheduleSlot(req.user.userId);
    
    // Get first connected account (we'll improve this later for multi-platform)
    const connection = await prisma.connectedAccount.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE'
      }
    });

    if (!connection) {
      return res.status(400).json({
        error: 'Please connect a social media account first'
      });
    }

    // Save to database
    const post = await prisma.postQueue.create({
      data: {
        userId: req.user.userId,
        accountId: connection.id,
        platform: connection.platform,
        content: postData.content,
        hashtags: postData.hashtags ? [postData.hashtags] : [],
        scheduledFor,
        mediaUrl: imageData?.url,
        status: 'pending'
      }
    });
    
    res.json(post);
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/bulk-generate - Generate multiple posts at once
router.post('/bulk-generate', requireAuth, async (req, res, next) => {
  try {
    const { count = 7, postTypes = ['general'] } = req.body;
    
    if (count > 30) {
      return res.status(400).json({ error: 'Maximum 30 posts per bulk generation' });
    }
    
    // Get user's business profile
    const business = await prisma.business.findUnique({
      where: { userId: req.user.userId }
    });
    
    if (!business) {
      return res.status(400).json({ 
        error: 'Please complete your business profile first' 
      });
    }
    
    // Get first connected account
    const connection = await prisma.connectedAccount.findFirst({
      where: {
        userId: req.user.userId,
        status: 'ACTIVE'
      }
    });

    if (!connection) {
      return res.status(400).json({
        error: 'Please connect a social media account first'
      });
    }

    const posts = [];
    let scheduledFor = await getNextScheduleSlot(req.user.userId);
    
    for (let i = 0; i < count; i++) {
      // Rotate through post types
      const postType = postTypes[i % postTypes.length];
      
      // Generate content
      const postData = await generateCompletePost(business, postType);
      const imageData = await getStockImage(business.type);
      
      // Create post
      const post = await prisma.postQueue.create({
        data: {
          userId: req.user.userId,
          accountId: connection.id,
          platform: connection.platform,
          content: postData.content,
          hashtags: postData.hashtags ? [postData.hashtags] : [],
          scheduledFor,
          mediaUrl: imageData?.url,
          status: 'pending'
        }
      });
      
      posts.push(post);
      
      // Schedule next post 1 day later (or based on user's plan)
      scheduledFor = new Date(scheduledFor.getTime() + 24 * 60 * 60 * 1000);
    }
    
    res.json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/posts/:id - Update a post (approve, edit, reschedule)
router.patch('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, scheduledFor, status, platforms } = req.body;
    
    // Verify ownership
    const existingPost = await prisma.postQueue.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });
    
    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Update post
    const updatedPost = await prisma.postQueue.update({
      where: { id },
      data: {
        ...(content && { content }),
        ...(scheduledFor && { scheduledFor: new Date(scheduledFor) }),
        ...(status && { status: status.toLowerCase() })
      }
    });
    
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/posts/:id - Delete a post
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const post = await prisma.postQueue.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    await prisma.postQueue.delete({
      where: { id }
    });
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

// POST /api/posts/:id/publish-now - Publish a post immediately
router.post('/:id/publish-now', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const post = await prisma.postQueue.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Update status to publishing
    await prisma.postQueue.update({
      where: { id },
      data: {
        status: 'publishing',
        scheduledFor: new Date() // Set to now
      }
    });
    
    // TODO: Trigger publishing job (will be in publishing service)
    
    res.json({ success: true, message: 'Post queued for immediate publishing' });
  } catch (error) {
    next(error);
  }
});

/**
 * Helper: Calculate next available schedule slot
 */
async function getNextScheduleSlot(userId) {
  // Get the latest scheduled post
  const latestPost = await prisma.postQueue.findFirst({
    where: {
      userId,
      status: { in: ['pending', 'approved'] }
    },
    orderBy: { scheduledFor: 'desc' }
  });
  
  if (!latestPost) {
    // No existing posts, schedule for tomorrow at 10 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow;
  }
  
  // Schedule 1 day after the latest post
  const nextSlot = new Date(latestPost.scheduledFor);
  nextSlot.setDate(nextSlot.getDate() + 1);
  return nextSlot;
}

export default router;
