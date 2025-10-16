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
  reconnect: true,
  // Keep connection alive
  idleTimeout: 300000, // 5 minutes
  maxIdle: 10,
  // Additional stability settings
  keepAliveInitialDelay: 0,
  enableKeepAlive: true
};

let pool;

const connectDB = async () => {
  try {
    // Create connection pool instead of single connection
    pool = mysql.createPool(dbConfig);
    
    // Test the pool with a simple query
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    console.log('Connected to MySQL database with connection pooling');
    connection.release();
    
    // Handle pool events for better monitoring
    pool.on('connection', function (connection) {
      console.log('New connection established as id ' + connection.threadId);
    });
    
    pool.on('error', function(err) {
      console.error('Database pool error:', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Database connection lost. Pool will handle reconnection.');
      } else {
        console.error('Database pool error:', err);
      }
    });
    
    return pool;
  } catch (error) {
    console.error('Database connection failed:', error);
    // Don't exit process, let it retry
    setTimeout(connectDB, 5000); // Retry after 5 seconds
  }
};

const getConnection = () => {
  if (!pool) {
    throw new Error('Database pool not initialized. Call connectDB() first.');
  }
  return pool;
};

// Graceful shutdown
process.on('SIGINT', async () => {
  if (pool) {
    console.log('Closing database pool...');
    await pool.end();
    console.log('Database pool closed.');
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  if (pool) {
    console.log('Closing database pool...');
    await pool.end();
    console.log('Database pool closed.');
  }
  process.exit(0);
});

module.exports = { connectDB, getConnection };