require('dotenv').config();
const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const seed = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Seeding started...');

    // 1. Clear existing data (optional, but good for clean seed)
    console.log('Cleaning up existing data...');
    await pool.query('TRUNCATE tasks, users RESTART IDENTITY CASCADE');

    // 2. Create Users
    console.log('Creating sample users...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    const user1 = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Admin User', 'admin@example.com', passwordHash, 'admin']
    );
    const user2 = await pool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Regular User', 'user@example.com', passwordHash, 'user']
    );

    const adminId = user1.rows[0].id;
    const userId = user2.rows[0].id;

    // 3. Create Tasks
    console.log('Creating sample tasks...');
    const tasks = [
      { title: 'Thiết lập project', description: 'Khởi tạo nodejs và express', status: 'done', priority: 'high', user_id: adminId },
      { title: 'Viết tài liệu API', description: 'Sử dụng Swagger để viết doc', status: 'in_progress', priority: 'medium', user_id: adminId },
      { title: 'Học React cơ bản', description: 'Xem tutorial trên Youtube', status: 'todo', priority: 'low', user_id: userId },
      { title: 'Đi mua sắm', description: 'Mua rau củ quả cho cả tuần', status: 'todo', priority: 'medium', user_id: userId },
    ];

    for (const task of tasks) {
      await pool.query(
        'INSERT INTO tasks (title, description, status, priority, user_id) VALUES ($1, $2, $3, $4, $5)',
        [task.title, task.description, task.status, task.priority, task.user_id]
      );
    }

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seed();
