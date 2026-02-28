import { verifyToken } from '../services/auth.js';

export function requireAuth(req, res, next) {
  try {
    console.log('[requireAuth] Checking authentication for:', req.method, req.path);
    
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('[requireAuth] No auth header or wrong format');
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('[requireAuth] Token found, verifying...');
    
    // Verify token
    const decoded = verifyToken(token);
    console.log('[requireAuth] Token valid for user:', decoded.userId);
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };
    
    next();
  } catch (error) {
    console.log('[requireAuth] Auth failed:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
