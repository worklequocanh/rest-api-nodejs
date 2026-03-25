const errorHandler = require('../../src/middlewares/error.middleware');

describe('Error Middleware', () => {
  let mockReq;
  let mockRes;
  let next;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    console.error = jest.fn(); // Suppress console error in tests
  });

  it('should handle custom error status and message', () => {
    const error = new Error('Custom error');
    error.status = 400;

    errorHandler(error, mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      success: false,
      message: 'Custom error'
    }));
  });

  it('should default to 500 status', () => {
    const error = new Error('Generic error');

    errorHandler(error, mockReq, mockRes, next);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });
});
