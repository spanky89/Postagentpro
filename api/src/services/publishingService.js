import { prisma } from '../lib/db.js';
import { publishToGoogle, refreshGoogleToken, needsTokenRefresh } from './publishers/googlePublisher.js';
import { publishToFacebook } from './publishers/facebookPublisher.js';

/**
 * Process due posts and publish them
 */
export async function processDuePosts() {
  try {
    // Find posts that are due to be published
    const duePosts = await prisma.postQueue.findMany({
      where: {
        status: { in: ['pending', 'approved'] },
        scheduledFor: {
          lte: new Date()
        }
      },
      include: {
        account: true,
        user: {
          include: {
            business: true
          }
        }
      },
      take: 10 // Process in batches
    });

    console.log(`[Publishing] Found ${duePosts.length} due posts`);

    for (const post of duePosts) {
      await publishPost(post);
    }

    return {
      processed: duePosts.length,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('[Publishing] Error processing due posts:', error);
    throw error;
  }
}

/**
 * Publish a single post to all configured platforms
 */
export async function publishPost(post) {
  try {
    console.log(`[Publishing] Starting publish for post ${post.id}`);

    // Update status to publishing
    await prisma.postQueue.update({
      where: { id: post.id },
      data: { status: 'publishing' }
    });

    const connection = post.account;

    if (!connection || connection.status !== 'ACTIVE') {
      throw new Error('No active connection found for this post');
    }

    let result;

    try {
      if (connection.platform === 'GOOGLE') {
        // Check if token needs refresh
        if (needsTokenRefresh(connection.tokenExpiry)) {
          const { accessToken, expiresIn } = await refreshGoogleToken(connection.refreshToken);
          
          // Update token in database
          await prisma.connectedAccount.update({
            where: { id: connection.id },
            data: {
              accessToken,
              tokenExpiry: new Date(Date.now() + expiresIn * 1000)
            }
          });

          connection.accessToken = accessToken;
        }

        result = await publishToGoogle(post, connection.accessToken);
      } else if (connection.platform === 'FACEBOOK') {
        result = await publishToFacebook(post, connection.accessToken);
      }

      if (result.success) {
        // Update post as published
        await prisma.postQueue.update({
          where: { id: post.id },
          data: {
            status: 'published',
            publishedAt: new Date(),
            platformPostId: result.platformPostId
          }
        });

        // Create analytics record
        await prisma.analytics.create({
          data: {
            postId: post.id,
            platform: connection.platform
          }
        });

        console.log(`[Publishing] ✅ Post ${post.id} published successfully to ${connection.platform}`);
      }
    } catch (platformError) {
      console.error(`[Publishing] Error publishing to ${connection.platform}:`, platformError);
      
      // Update post as failed
      await prisma.postQueue.update({
        where: { id: post.id },
        data: {
          status: 'failed',
          errorMessage: platformError.message
        }
      });
      
      throw platformError;
    }

    return {
      success: result.success,
      result
    };
  } catch (error) {
    console.error(`[Publishing] Fatal error for post ${post.id}:`, error);

    // Update status to failed (if not already updated)
    await prisma.postQueue.update({
      where: { id: post.id },
      data: {
        status: 'failed',
        errorMessage: error.message
      }
    }).catch(() => {}); // Ignore if already updated

    throw error;
  }
}

/**
 * Retry failed posts
 */
export async function retryFailedPosts(maxRetries = 3) {
  try {
    const failedPosts = await prisma.postQueue.findMany({
      where: {
        status: 'failed',
        retryCount: {
          lt: maxRetries
        }
      },
      include: {
        account: true,
        user: {
          include: {
            business: true
          }
        }
      },
      take: 5
    });

    console.log(`[Publishing] Retrying ${failedPosts.length} failed posts`);

    for (const post of failedPosts) {
      await prisma.postQueue.update({
        where: { id: post.id },
        data: {
          retryCount: { increment: 1 }
        }
      });

      try {
        await publishPost(post);
      } catch (error) {
        console.error(`[Publishing] Retry failed for post ${post.id}:`, error);
      }
    }

    return {
      retried: failedPosts.length
    };
  } catch (error) {
    console.error('[Publishing] Error retrying failed posts:', error);
    throw error;
  }
}

/**
 * Get publishing stats
 */
export async function getPublishingStats(userId) {
  try {
    const [total, pending, published, failed] = await Promise.all([
      prisma.postQueue.count({ where: { userId } }),
      prisma.postQueue.count({ where: { userId, status: 'pending' } }),
      prisma.postQueue.count({ where: { userId, status: 'published' } }),
      prisma.postQueue.count({ where: { userId, status: 'failed' } })
    ]);

    return {
      total,
      pending,
      published,
      failed,
      successRate: total > 0 ? Math.round((published / total) * 100) : 0
    };
  } catch (error) {
    console.error('[Publishing] Error getting stats:', error);
    throw error;
  }
}
