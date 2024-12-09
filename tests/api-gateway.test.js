// tests/api-gateway.test.js
const request = require('supertest');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => (req, res, next) => next())
}));

describe('API Gateway', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(cors());

    app.use('/api/user', createProxyMiddleware({
      target: "http://localhost:3002/api/auth",
      changeOrigin: true
    }));

    app.use('/api/product', createProxyMiddleware({
      target: "http://localhost:3001/api/product",
      changeOrigin: true
    }));

    app.use('/api/order', createProxyMiddleware({
      target: "http://localhost:3003/api/order",
      changeOrigin: true
    }));

    app.use((req, res) => res.status(404).send('API Gateway: Route not found'));
  });

  describe('Proxy Routing', () => {
    it('should route /api/user requests correctly', async () => {
      const response = await request(app)
        .get('/api/user/test');

      expect(createProxyMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
          target: "http://localhost:3002/api/auth"
        })
      );
    });

    it('should route /api/product requests correctly', async () => {
      const response = await request(app)
        .get('/api/product/test');

      expect(createProxyMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
          target: "http://localhost:3001/api/product"
        })
      );
    });

    it('should route /api/order requests correctly', async () => {
      const response = await request(app)
        .get('/api/order/test');

      expect(createProxyMiddleware).toHaveBeenCalledWith(
        expect.objectContaining({
          target: "http://localhost:3003/api/order"
        })
      );
    });

    it('should return 404 for undefined routes', async () => {
      const response = await request(app)
        .get('/api/undefined');

      expect(response.statusCode).toBe(404);
      expect(response.text).toBe('API Gateway: Route not found');
    });
  });
});