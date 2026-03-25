const taskModel = require('../models/task.model');

const getAllTasks = async (userId, filters) => {
  return await taskModel.findAll(userId, filters);
};

const getTaskById = async (id, userId) => {
  const task = await taskModel.findById(id, userId);
  if (!task) {
    const error = new Error('Task not found');
    error.status = 404;
    throw error;
  }
  return task;
};

const createTask = async (userId, taskData) => {
  return await taskModel.create(userId, taskData);
};

const updateTask = async (id, userId, taskData) => {
  const task = await taskModel.update(id, userId, taskData);
  if (!task) {
    const error = new Error('Task not found or not authorized to update');
    error.status = 404;
    throw error;
  }
  return task;
};

const deleteTask = async (id, userId) => {
  const deleted = await taskModel.deleteById(id, userId);
  if (!deleted) {
    const error = new Error('Task not found or not authorized to delete');
    error.status = 404;
    throw error;
  }
  return true;
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
