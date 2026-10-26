const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, isConnected } = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    database: isConnected() ? 'mongodb' : 'local_fallback',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount routes
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Personal Task Manager API is running',
    endpoints: {
      tasks: '/api/tasks',
      health: '/api/health'
    }
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Personal Task Manager Server running on http://localhost:${PORT}`);
  console.log(`📡 API Endpoints available at http://localhost:${PORT}/api/tasks`);
});
