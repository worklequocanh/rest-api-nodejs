const db = require('../config/database');

const findAll = async (userId, filters = {}) => {
  const { status, priority, page = 1, limit = 10, sort = 'created_at', order = 'desc' } = filters;
  const offset = (page - 1) * limit;

  let query = 'SELECT * FROM tasks WHERE user_id = $1';
  const params = [userId];

  if (status) {
    params.push(status);
    query += ` AND status = $${params.length}`;
  }

  if (priority) {
    params.push(priority);
    query += ` AND priority = $${params.length}`;
  }

  query += ` ORDER BY ${sort} ${order} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const result = await db.query(query, params);
  
  // Get total count for pagination meta
  let countQuery = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
  const countParams = [userId];

  if (status) {
    countParams.push(status);
    countQuery += ` AND status = $${countParams.length}`;
  }

  if (priority) {
    countParams.push(priority);
    countQuery += ` AND priority = $${countParams.length}`;
  }

  const countResult = await db.query(countQuery, countParams);
  const total = parseInt(countResult.rows[0].count);

  return {
    tasks: result.rows,
    meta: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

const findById = async (id, userId) => {
  const result = await db.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [id, userId]);
  return result.rows[0];
};

const create = async (userId, taskData) => {
  const { title, description, status, priority, due_date } = taskData;
  const result = await db.query(
    'INSERT INTO tasks (title, description, status, priority, due_date, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [title, description, status || 'todo', priority || 'medium', due_date, userId]
  );
  return result.rows[0];
};

const update = async (id, userId, taskData) => {
  const fields = [];
  const params = [id, userId];
  let i = 3;

  for (const [key, value] of Object.entries(taskData)) {
    if (value !== undefined) {
      fields.push(`${key} = $${i}`);
      params.push(value);
      i++;
    }
  }

  if (fields.length === 0) return null;

  const query = `UPDATE tasks SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $1 AND user_id = $2 RETURNING *`;
  const result = await db.query(query, params);
  return result.rows[0];
};

const deleteById = async (id, userId) => {
  const result = await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
  return result.rowCount > 0;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  deleteById,
};
