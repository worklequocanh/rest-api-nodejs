const taskService = require('../services/task.service');
const { successResponse } = require('../utils/response');

const getAllTasks = async (req, res, next) => {
  try {
    const filters = req.query;
    const { tasks, meta } = await taskService.getAllTasks(req.user.id, filters);
    res.json(successResponse(tasks, 'Tasks retrieved successfully', meta));
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    res.json(successResponse(task));
  } catch (err) {
    next(err);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    res.status(201).json(successResponse(task, 'Task created successfully'));
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    res.json(successResponse(task, 'Task updated successfully'));
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id);
    res.json(successResponse(null, 'Task deleted successfully'));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
