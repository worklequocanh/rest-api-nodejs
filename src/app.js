require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorResponse } = require('./utils/response');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to REST API Task Manager' });
});

// To be added: Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json(errorResponse('Resource not found'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json(errorResponse(err.message || 'Internal Server Error'));
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;
