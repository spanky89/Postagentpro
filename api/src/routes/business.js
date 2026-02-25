import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/business - Get user's business profile
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const business = await prisma.business.findUnique({
      where: { userId: req.user.userId }
    });
    
    res.json(business);
  } catch (error) {
    next(error);
  }
});

// POST /api/business - Create or update business profile
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, type, locationCity, locationState, description, website } = req.body;

    // Validation
    if (!name || !type || !locationCity || !locationState) {
      return res.status(400).json({ 
        error: 'Name, type, city, and state are required' 
      });
    }

    // Check if business profile already exists
    const existing = await prisma.business.findUnique({
      where: { userId: req.user.userId }
    });

    let business;
    if (existing) {
      // Update existing
      business = await prisma.business.update({
        where: { userId: req.user.userId },
        data: {
          name,
          type,
          locationCity,
          locationState,
          description,
          website
        }
      });
    } else {
      // Create new
      business = await prisma.business.create({
        data: {
          userId: req.user.userId,
          name,
          type,
          locationCity,
          locationState,
          description,
          website
        }
      });
    }

    res.json(business);
  } catch (error) {
    next(error);
  }
});

export default router;
