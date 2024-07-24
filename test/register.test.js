// tests/register.test.js
import bcrypt from 'bcryptjs';
import { register } from '../controllers/authController.js';
import User from '../models/User.js';

jest.mock('bcryptjs');
jest.mock('../models/User.js');

describe('register', () => {
  it('should hash password and create a user', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.findOne.mockResolvedValue(null); // No user exists
    User.create.mockResolvedValue({ id: 1, ...req.body });

    await register(req, res);

    expect(bcrypt.hash).toHaveBeenCalledWith('password123', expect.any(Number));
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'testuser@example.com' } });
    expect(User.create).toHaveBeenCalledWith({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'hashedPassword'
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      msg: 'registered successfully'
    });
  });

  it('should handle user already exists', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue({ id: 1, ...req.body }); // User exists

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User already exists' });
  });

  it('should handle errors during user creation', async () => {
    const req = {
      body: {
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    bcrypt.hash.mockResolvedValue('hashedPassword');
    User.findOne.mockResolvedValue(null); // No user exists
    User.create.mockRejectedValue(new Error('Database error'));

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });
});