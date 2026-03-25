const express = require('express');
const Joi = require('joi');
const authController = require('../controllers/auth.controller');
const validate = require('../middlewares/validate.middleware');
const auth = require('../middlewares/auth.middleware');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(8),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', auth, authController.getMe);

module.exports = router;
