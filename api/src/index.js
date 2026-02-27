import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/health.js';
import businessRoutes from './routes/business.js';
import connectionsRoutes from './routes/connections.js';
import postsRoutes from './routes/posts.js';
import { startPublishingJob } from './jobs/publishingJob.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Test endpoint before middleware
app.get('/', (req, res) => {
  res.send('PostAgentPro API is running');
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/business', businessRoutes);
app.use('/api/connections', connectionsRoutes);
app.use('/api/posts', postsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PostAgentPro API running on http://0.0.0.0:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  
  // Start background publishing job with error handling
  try {
    startPublishingJob();
    console.log('⏰ Publishing job started');
  } catch (error) {
    console.error('⚠️ Failed to start publishing job:', error.message);
    console.log('Server will continue without background jobs');
  }
});
