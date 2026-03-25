const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'Dự án REST API quản lý công việc (Todo) với Node.js, Express và PostgreSQL',
      contact: {
        name: 'worklequocanh',
        email: 'worklequocanh@gmail.com',
      },
    },
    servers: [
      {
        url: 'https://rest-api-nodejs-6gol.onrender.com',
        description: 'Production server (Render)',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            description: { type: 'string' },
            status: { type: 'string', enum: ['todo', 'in_progress', 'done'] },
            priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            due_date: { type: 'string', format: 'date-time' },
            user_id: { type: 'integer' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'object' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Đường dẫn tới các file routes có JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = specs;
