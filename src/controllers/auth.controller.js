const authService = require('../services/auth.service');
const { successResponse } = require('../utils/response');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await authService.register(name, email, password);
    res.status(201).json(successResponse(user, 'User registered successfully'));
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(successResponse(data, 'Logged in successfully'));
  } catch (err) {
    next(err);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(successResponse(user));
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
