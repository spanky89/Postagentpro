import express from 'express';
import { prisma } from '../lib/db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// GET /api/connections - Get user's connected accounts
router.get('/', requireAuth, async (req, res, next) => {
  try {
    const connections = await prisma.connectedAccount.findMany({
      where: { userId: req.user.userId },
      select: {
        id: true,
        platform: true,
        accountName: true,
        status: true,
        connectedAt: true
      }
    });
    
    res.json(connections);
  } catch (error) {
    next(error);
  }
});

// POST /api/connections/google/initiate - Start Google OAuth flow
router.post('/google/initiate', requireAuth, async (req, res, next) => {
  try {
    const { GOOGLE_CLIENT_ID, FRONTEND_URL } = process.env;
    
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ 
        error: 'Google OAuth not configured. Please add GOOGLE_CLIENT_ID to environment variables.' 
      });
    }

    // Generate OAuth URL
    const redirectUri = `${FRONTEND_URL}/auth/google/callback`;
    const scope = 'https://www.googleapis.com/auth/business.manage';
    const state = req.user.userId; // Pass user ID in state for security
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`;

    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
});

// POST /api/connections/google/callback - Handle Google OAuth callback
router.post('/google/callback', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_URL } = process.env;
    
    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${FRONTEND_URL}/auth/google/callback`,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error_description || 'Failed to exchange authorization code');
    }

    const tokens = await tokenResponse.json();

    // Get user info from Google (email as accountId fallback)
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    });

    const userInfo = await userInfoResponse.json();
    const googleAccountId = userInfo.id || userInfo.email;
    const accountName = userInfo.email || 'Google Account';

    // Save to database (using schema field names)
    const connection = await prisma.connectedAccount.create({
      data: {
        userId: req.user.userId,
        platform: 'GOOGLE',
        accountId: googleAccountId,
        accountName,
        accessTokenEncrypted: tokens.access_token, // TODO: Encrypt in production
        refreshTokenEncrypted: tokens.refresh_token || '',
        tokenExpiresAt: new Date(Date.now() + (tokens.expires_in * 1000)),
        status: 'active'
      }
    });

    res.json({ 
      success: true,
      connection: {
        id: connection.id,
        platform: connection.platform,
        accountName: connection.accountName
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/connections/facebook/initiate - Start Facebook OAuth flow
router.post('/facebook/initiate', requireAuth, async (req, res, next) => {
  try {
    const { META_APP_ID, FRONTEND_URL } = process.env;
    
    if (!META_APP_ID) {
      return res.status(500).json({ 
        error: 'Facebook OAuth not configured. Please add META_APP_ID to environment variables.' 
      });
    }

    const redirectUri = `${FRONTEND_URL}/auth/facebook/callback`;
    const scope = 'pages_manage_posts,pages_read_engagement,business_management';
    const state = req.user.userId;
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${META_APP_ID}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `state=${state}`;

    res.json({ authUrl });
  } catch (error) {
    next(error);
  }
});

// POST /api/connections/facebook/callback - Handle Facebook OAuth callback
router.post('/facebook/callback', requireAuth, async (req, res, next) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const { META_APP_ID, META_APP_SECRET, FRONTEND_URL } = process.env;
    
    // Exchange code for access token
    const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${META_APP_ID}&` +
      `client_secret=${META_APP_SECRET}&` +
      `redirect_uri=${encodeURIComponent(FRONTEND_URL + '/auth/facebook/callback')}&` +
      `code=${code}`;

    const tokenResponse = await fetch(tokenUrl);
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error?.message || 'Failed to exchange authorization code');
    }

    const tokens = await tokenResponse.json();

    // Get user info for accountId
    const userResponse = await fetch(
      `https://graph.facebook.com/v18.0/me?access_token=${tokens.access_token}`
    );
    const user = await userResponse.json();
    
    // Get user's pages
    const pagesResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokens.access_token}`
    );
    const pages = await pagesResponse.json();
    
    const pageId = pages.data?.[0]?.id || user.id;
    const pageName = pages.data?.[0]?.name || user.name || 'Facebook Account';

    // Save to database (using schema field names)
    const connection = await prisma.connectedAccount.create({
      data: {
        userId: req.user.userId,
        platform: 'FACEBOOK',
        accountId: pageId,
        accountName: pageName,
        accessTokenEncrypted: tokens.access_token, // TODO: Encrypt in production
        refreshTokenEncrypted: '',
        status: 'active'
      }
    });

    res.json({ 
      success: true,
      connection: {
        id: connection.id,
        platform: connection.platform,
        accountName: connection.accountName
      }
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/connections/:id - Disconnect account
router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify ownership
    const connection = await prisma.connectedAccount.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!connection) {
      return res.status(404).json({ error: 'Connection not found' });
    }

    await prisma.connectedAccount.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
