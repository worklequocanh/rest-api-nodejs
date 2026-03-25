const validate = require('../../src/middlewares/validate.middleware');
const Joi = require('joi');

describe('Validate Middleware', () => {
  let mockReq;
  let mockRes;
  let next;

  beforeEach(() => {
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  it('should call next if validation passes', () => {
    const schema = Joi.object({ name: Joi.string().required() });
    mockReq.body = { name: 'Test' };
    
    validate(schema)(mockReq, mockRes, next);
    
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if validation fails', () => {
    const schema = Joi.object({ name: Joi.string().required() });
    
    validate(schema)(mockReq, mockRes, next);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
