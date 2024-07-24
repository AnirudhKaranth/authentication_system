// tests/integration.test.js
import request from 'supertest';
import express from 'express';
import cors from 'cors';
import "dotenv/config";
import sequelize from '../db.js';
import userRouter from '../routes/userRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use( userRouter);

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reset database
});

describe('Auth API Integration Tests', () => {
  let token;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
    expect(response.body).toHaveProperty('msg', 'registered successfully');
  });

  it('should login a user and return a JWT token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('msg', 'logged in successfully');

    token = response.body.token; // Save token for later use
  });

  it('should retrieve user profile', async () => {
    const response = await request(app)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
    expect(response.body).toHaveProperty('msg', 'profile fetched successfully');
  });

  it('should return 401 for unauthorized profile access', async () => {
    const response = await request(app)
      .get('/profile');

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('message', 'No token, authorization denied');
  });
});
