const db = require('../config/database');

const findByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const findById = async (id) => {
  const result = await db.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const create = async (name, email, passwordHash) => {
  const result = await db.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role, created_at',
    [name, email, passwordHash]
  );
  return result.rows[0];
};

module.exports = {
  findByEmail,
  findById,
  create,
};
