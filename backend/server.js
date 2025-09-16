const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/database');
const visitorRoutes = require('./routes/visitors');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Load environment-specific configuration
if (NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
}

// Middleware
app.use(cors());

// Configure CORS based on environment
const corsOrigins = NODE_ENV === 'production' 
  ? (process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['https://visitor.emudhra.com'])
  : [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://127.0.0.1:5173',
      'http://192.168.1.10:3001',
      'http://visitor-emudhra.local:3001',
      'http://192.168.1.10',
      'http://visitor-emudhra.local'
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api/visitors', visitorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();