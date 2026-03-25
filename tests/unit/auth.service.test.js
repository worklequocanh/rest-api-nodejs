const authService = require('../../src/services/auth.service');
const userModel = require('../../src/models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../../src/models/user.model');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      userModel.findByEmail.mockResolvedValue(null);
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');
      userModel.create.mockResolvedValue({ id: 1, name: 'Test', email: 'test@example.com' });

      const result = await authService.register('Test', 'test@example.com', 'password123');

      expect(result.name).toBe('Test');
      expect(userModel.create).toHaveBeenCalledWith('Test', 'test@example.com', 'hashedPassword');
    });

    it('should throw error if email exists', async () => {
      userModel.findByEmail.mockResolvedValue({ id: 1 });

      await expect(authService.register('Test', 'test@example.com', 'password123'))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login successfully with correct credentials', async () => {
      const user = { id: 1, email: 'test@example.com', password_hash: 'hashed', role: 'user' };
      userModel.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-token');

      const result = await authService.login('test@example.com', 'password123');

      expect(result.token).toBe('fake-token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should throw if password does not match', async () => {
      userModel.findByEmail.mockResolvedValue({ password_hash: 'hashed' });
      bcrypt.compare.mockResolvedValue(false);

      await expect(authService.login('test@example.com', 'wrong'))
        .rejects.toThrow('Invalid email or password');
    });

    it('should throw if user not found', async () => {
      userModel.findByEmail.mockResolvedValue(null);

      await expect(authService.login('notfound@example.com', 'pwd'))
        .rejects.toThrow('Invalid email or password');
    });
  });

  describe('getMe', () => {
    it('should return user profile if found', async () => {
      userModel.findById.mockResolvedValue({ id: 1, name: 'Test' });
      const result = await authService.getMe(1);
      expect(result.id).toBe(1);
    });

    it('should throw error if user not found', async () => {
      userModel.findById.mockResolvedValue(null);
      await expect(authService.getMe(99))
        .rejects.toThrow('User not found');
    });
  });
});
