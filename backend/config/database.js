const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Default XAMPP MySQL password is empty
  database: process.env.DB_NAME || 'visitor_management',
  port: process.env.DB_PORT || 3306,
  // Connection pool settings
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
  // Keep connection alive
  idleTimeout: 300000, // 5 minutes
  maxIdle: 10
};

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool(dbConfig);
    
    // Test the connection
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database with connection pooling');
    connection.release();
    
    // Handle pool events
    pool.on('connection', function (connection) {
      console.log('New connection established as id ' + connection.threadId);
    });
    
    pool.on('error', function(err) {
      console.error('Database pool error:', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Reconnecting to database...');
        // Pool will automatically handle reconnection
      } else {
        throw err;
      }
    });
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const getConnection = () => {
  if (!pool) {
    throw new Error('Database not connected');
  }
  return pool;
};

module.exports = { connectDB, getConnection };