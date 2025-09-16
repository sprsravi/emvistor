const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', // Default XAMPP MySQL password is empty
  database: process.env.DB_NAME || 'visitor_management',
  port: process.env.DB_PORT || 3306
};

let connection;

const connectDB = async () => {
  try {
    connection = await mysql.createConnection(dbConfig);
    console.log('Connected to MySQL database');
    return connection;
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const getConnection = () => {
  if (!connection) {
    throw new Error('Database not connected');
  }
  return connection;
};

module.exports = { connectDB, getConnection };