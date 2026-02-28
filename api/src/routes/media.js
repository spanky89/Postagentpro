import express from 'express';
import { prisma } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, GIF, WebP)'));
    }
  }
});

// GET /api/media - Get user's uploaded photos
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const photos = await prisma.mediaLibrary.findMany({
      where: { userId: req.user.userId },
      orderBy: { uploadedAt: 'desc' }
    });
    
    res.json(photos);
  } catch (error) {
    next(error);
  }
});

// POST /api/media/upload - Upload a single photo
router.post('/upload', requireAuth, upload.single('photo'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Save to database
    const photo = await prisma.mediaLibrary.create({
      data: {
        userId: req.user.userId,
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}`, // Relative URL
        sizeBytes: req.file.size,
        mimeType: req.file.mimetype,
        source: 'upload'
      }
    });
    
    res.json(photo);
  } catch (error) {
    next(error);
  }
});

// POST /api/media/upload-multiple - Upload multiple photos
router.post('/upload-multiple', requireAuth, upload.array('photos', 50), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    
    // Save all to database
    const photos = await Promise.all(
      req.files.map(file =>
        prisma.mediaLibrary.create({
          data: {
            userId: req.user.userId,
            filename: file.filename,
            url: `/uploads/${file.filename}`,
            sizeBytes: file.size,
            mimeType: file.mimetype,
            source: 'upload'
          }
        })
      )
    );
    
    res.json({
      success: true,
      count: photos.length,
      photos
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/media/:id - Delete a photo
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verify ownership
    const photo = await prisma.mediaLibrary.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });
    
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found' });
    }
    
    // Delete from database
    await prisma.mediaLibrary.delete({
      where: { id }
    });
    
    // TODO: Delete physical file from disk
    
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
