import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.NEXT_PUBLIC_DB_HOST,
  user: process.env.NEXT_PUBLIC_DB_USER,
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  database: process.env.NEXT_PUBLIC_DB_NAME,
  port: Number(process.env.NEXT_PUBLIC_DB_PORT),
});

export default pool;
