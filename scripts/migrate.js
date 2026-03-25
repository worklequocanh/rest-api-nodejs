require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

console.log('Migration script started...');

const migrate = async () => {
  console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  const filePath = path.join(__dirname, '../migrations/001_initial_schema.sql');
  
  try {
    console.log('Reading migration file...');
    const sql = fs.readFileSync(filePath, 'utf8');
    
    console.log('Connecting and running migration query...');
    await pool.query(sql);
    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('Database pool closed.');
  }
};

migrate().then(() => {
  console.log('Migration script finished.');
  process.exit(0);
});
