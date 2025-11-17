import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();
console.log('cwd:', process.cwd());
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});


const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hackradar',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
