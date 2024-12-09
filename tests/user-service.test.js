const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/user');
const userRoutes = require('../routes/user');
const bcrypt = require('bcrypt');

require('dotenv').config({ path: '.env.test' });

jest.setTimeout(30000);

describe('User Service API', () => {
  let app;
  let mongoServer;
  
  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    app = express();
    app.use(express.json());
    app.use('/api/auth', userRoutes);

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }, 20000);

  afterAll(async () => {
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  }, 20000);

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'validpassword123',
        phone: '1234567890',
        address: '123 Test Street'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.phone).toBe(userData.phone);
      expect(response.body.user.address).toBe(userData.address);

      const savedUser = await User.findOne({ email: userData.email });
      expect(savedUser).toBeTruthy();
    });

    it('should handle duplicate email or phone', async () => {
      const existingUserData = {
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'existingpassword',
        phone: '9876543210',
        address: '456 Existing Street'
      };

      // First, create an existing user
      await User.create({
        ...existingUserData,
        password: await bcrypt.hash(existingUserData.password, 10)
      });

      // Try to register with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(existingUserData)
        .expect(400);

      expect(response.body.message).toBe('Email hoặc số điện thoại đã tồn tại');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const userData = {
        username: 'loginuser',
        email: 'login@example.com',
        password: 'validpassword123',
        phone: '5555555555',
        address: '789 Login Street'
      };

      // Create user first
      await User.create({
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      });

      // Attempt login
      const response = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: userData.email, 
          password: userData.password 
        })
        .expect(200);

      expect(response.body.message).toBe('Đăng nhập thành công');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should reject login with incorrect password', async () => {
      const userData = {
        username: 'loginuser',
        email: 'login@example.com',
        password: 'validpassword123',
        phone: '5555555555',
        address: '789 Login Street'
      };

      // Create user first
      await User.create({
        ...userData,
        password: await bcrypt.hash(userData.password, 10)
      });

      // Attempt login with wrong password
      const response = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: userData.email, 
          password: 'wrongpassword' 
        })
        .expect(401);

      expect(response.body.message).toBe('Sai mật khẩu');
    });

    it('should reject login for non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: 'nonexistent@example.com', 
          password: 'somepassword' 
        })
        .expect(404);

      expect(response.body.message).toBe('Người dùng không tồn tại');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200);

      expect(response.body.message).toBe('Đăng xuất thành công');
    });
  });
});