const express = require('express');
const Joi = require('joi');
const taskController = require('../controllers/task.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

const createTaskSchema = Joi.object({
  title: Joi.string().required().min(1).max(255),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  due_date: Joi.date().iso().allow(null),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  description: Joi.string().allow('', null),
  status: Joi.string().valid('todo', 'in_progress', 'done'),
  priority: Joi.string().valid('low', 'medium', 'high'),
  due_date: Joi.date().iso().allow(null),
}).min(1);

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('todo', 'in_progress', 'done').required(),
});

// All routes require authentication
router.use(auth);

router.get('/', taskController.getAllTasks);
router.post('/', validate(createTaskSchema), taskController.createTask);
router.get('/:id', taskController.getTaskById);
router.put('/:id', validate(updateTaskSchema), taskController.updateTask);
router.patch('/:id/status', validate(updateStatusSchema), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
