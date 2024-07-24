// tests/getProfile.test.js
import { getProfile } from '../controllers/authController.js';
import User from '../models/User.js';

jest.mock('../models/User.js');

describe('getProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile information when token is valid', async () => {
    const req = {
      user: { userId: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue({ id: 1, username: 'testuser', email: 'testuser@example.com' });

    await getProfile(req, res);

    console.log('User.findOne calls:', User.findOne.mock.calls);

    expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      username: 'testuser',
      email: 'testuser@example.com',
      msg: 'profile fetched successfully'
    });
  });

  it('should handle user not found', async () => {
    const req = {
      user: { userId: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockResolvedValue(null);

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'User does not exist' });
  });

  it('should handle errors during profile retrieval', async () => {
    const req = {
      user: { userId: 1 }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    User.findOne.mockRejectedValue(new Error('Database error'));

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Server error' });
  });

  it('should return 401 if no token is provided', async () => {
    const req = {
      user: undefined // No user information in request
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
  });
});
