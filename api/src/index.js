import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

console.log(`Starting server on port ${PORT}...`);
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);

// CORS configuration - must come BEFORE routes
const allowedOrigins = [
  'https://postagentpro.com',
  'https://www.postagentpro.com',
  'http://localhost:3000'
];
console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight for all routes
app.options('*', cors());

app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
  console.log('Root endpoint hit');
  res.send('PostAgentPro API is running');
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Import routes after app is created
let authRoutes, healthRoutes, businessRoutes, connectionsRoutes, postsRoutes, mediaRoutes, startPublishingJob;

(async () => {
  try {
    console.log('Loading routes...');
    const modules = await Promise.all([
      import('./routes/auth.js'),
      import('./routes/health.js'),
      import('./routes/business.js'),
      import('./routes/connections.js'),
      import('./routes/posts.js'),
      import('./routes/media.js'),
      import('./jobs/publishingJob.js')
    ]);
    
    [authRoutes, healthRoutes, businessRoutes, connectionsRoutes, postsRoutes, mediaRoutes, { startPublishingJob }] = modules.map(m => m.default || m);
    
    console.log('Routes loaded, mounting...');
    
    // Routes
    app.use('/api/health', healthRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/business', businessRoutes);
    app.use('/api/connections', connectionsRoutes);
    app.use('/api/posts', postsRoutes);
    app.use('/api/media', mediaRoutes);
    
    console.log('Routes mounted');
    
    // Start background job (TEMPORARILY DISABLED FOR DEBUGGING)
    // if (startPublishingJob) {
    //   try {
    //     startPublishingJob();
    //     console.log('⏰ Publishing job started');
    //   } catch (error) {
    //     console.error('⚠️ Failed to start publishing job:', error.message);
    //   }
    // }
    console.log('⚠️ Publishing job disabled for debugging');
  } catch (error) {
    console.error('Error loading routes:', error);
  }
})();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// Start server IMMEDIATELY, before routes finish loading
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 PostAgentPro API listening on 0.0.0.0:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
