const { successResponse, errorResponse } = require('../../src/utils/response');

describe('Response Utility', () => {
  describe('successResponse', () => {
    it('should return correct format', () => {
      const result = successResponse({ id: 1 }, 'Success');
      expect(result).toEqual({
        success: true,
        data: { id: 1 },
        message: 'Success'
      });
    });

    it('should include meta if provided', () => {
      const result = successResponse([], 'OK', { page: 1 });
      expect(result.meta).toEqual({ page: 1 });
    });
  });

  describe('errorResponse', () => {
    it('should return correct format', () => {
      const result = errorResponse('Error', ['msg']);
      expect(result).toEqual({
        success: false,
        message: 'Error',
        errors: ['msg']
      });
    });
  });
});
