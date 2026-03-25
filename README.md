# Task Management REST API

A robust RESTful API for Task Management built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication**: JWT-based user registration and login.
- **Task CRUD**: Full Create, Read, Update, and Delete operations for tasks.
- **Task Management**: Pagination, filtering (by status, priority), and sorting.
- **Security**: Helmet headers, CORS, and centralized error handling.
- **Documentation**: Interactive API docs with Swagger/OpenAPI 3.0.
- **Testing**: Comprehensive Unit and Integration tests with Jest (Coverage > 90%).
- **Firebase**: Integrated Firebase configuration for external service support.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+)
- [PostgreSQL](https://www.postgresql.org/)
- Firebase Project credentials

## Installation

1. **Clone the repository**:
   ```bash
   git clone git@github-study:worklequocanh/rest-api-nodejs.git
   cd rest-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Fill in your PostgreSQL credentials and JWT secret.

4. **Database Migration**:
   ```bash
   npm run migrate
   ```

5. **(Optional) Seed Data**:
   ```bash
   npm run seed
   ```

## Running the API

- **Development Mode**: `npm run dev` (starts server on port 3000 by default)
- **Production Mode**: `npm start`

## API Documentation

Once the server is running, visit:
`http://localhost:3000/api-docs`

## Testing

Run all tests and generate coverage report:
```bash
npm run test:coverage
```

## Project Structure

```text
rest-api/
├── migrations/          # SQL migration files
├── scripts/             # Migration and seed scripts
├── src/
│   ├── config/          # Database, Swagger, Firebase config
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Auth, Validate, Error middlewares
│   ├── models/          # Database query logic
│   ├── routes/          # API route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Helper utilities
│   └── app.js           # Express app setup
└── tests/               # Unit and Integration tests
```

## Authors

- **worklequocanh** - [worklequocanh@gmail.com]
