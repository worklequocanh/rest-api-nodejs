const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');

const register = async (name, email, password) => {
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) {
    const error = new Error('Email already exists');
    error.status = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await userModel.create(name, email, passwordHash);
  return user;
};

const login = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

const getMe = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

module.exports = {
  register,
  login,
  getMe,
};
