// tests/login.test.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { login } from '../controllers/authController.js';
import User from '../models/User.js';

jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../models/User.js');

describe('login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should login a user and return a JWT token', async () => {
    const req = {
      body: {
        email: 'testuser@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Mock User.findOne to return a user object
    User.findOne.mockResolvedValue({ id: 1, username: 'testuser', email: 'testuser@example.com', password: 'hashedPassword' });

    // Mock bcrypt.compare to return true (password matches)
    bcrypt.compare.mockResolvedValue(true);

    // Mock jwt.sign to return a JWT token
    jwt.sign.mockReturnValue('jwtToken');

    await login(req, res);

    console.log('bcrypt.compare calls:', bcrypt.compare.mock.calls);
    console.log('jwt.sign calls:', jwt.sign.mock.calls);

    expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
    expect(jwt.sign).toHaveBeenCalledWith({ userId: 1, name: 'testuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      token: 'jwtToken',
      msg: 'logged in successfully'
    });
  });

  it('should handle incorrect password', async () => {
    const req = {
      body: {
        email: 'testuser@example.com',
        password: 'wrongpassword'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue({ id: 1, username: 'testuser', email: 'testuser@example.com', password: 'hashedPassword' });
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('should handle user not found', async () => {
    const req = {
      body: {
        email: 'nonexistent@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User does not exist' });
  });

  it('should handle errors during login', async () => {
    const req = {
      body: {
        email: 'testuser@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockRejectedValue(new Error('Database error'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});
