const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Order = require('../models/order');
const orderRoutes = require('../routes/order');
const axios = require('axios');

jest.mock('axios');

jest.setTimeout(30000);

describe('Order Service API', () => {
  let app;
  let mongoServer;
  
  beforeAll(async () => {
    // Use mongodb-memory-server for test database
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    app = express();
    app.use(express.json());
    app.use('/api/order', orderRoutes);

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
    await Order.deleteMany({});
  });

  describe('POST /api/order', () => {
    it('should create a new order', async () => {
      const customerId = new mongoose.Types.ObjectId();
      const productId = new mongoose.Types.ObjectId();

      const orderData = {
        customer: customerId,
        items: [{ 
          product: productId, 
          quantity: 2 
        }],
        totalPrice: 100
      };

      const response = await request(app)
        .post('/api/order')
        .send(orderData)
        .expect(201);

      expect(response.body.message).toBe('Đơn hàng đã được tạo thành công');

      expect(new mongoose.Types.ObjectId(response.body.order.customer)).toEqual(customerId);
      expect(new mongoose.Types.ObjectId(response.body.order.items[0].product)).toEqual(productId);
      expect(response.body.order.items[0].quantity).toBe(2);
      expect(response.body.order.totalPrice).toBe(100);
      expect(response.body.order.status).toBe('Pending');

      const savedOrder = await Order.findById(response.body.order._id);
      expect(savedOrder).toBeTruthy();
    });
  });

  describe('GET /api/order/user/:userId', () => {
    it('should fetch orders for a specific user', async () => {
      const customerId = new mongoose.Types.ObjectId();
      const productId1 = new mongoose.Types.ObjectId();
      const productId2 = new mongoose.Types.ObjectId();

      const testOrders = [
        {
          customer: customerId,
          items: [{ product: productId1, quantity: 2 }],
          totalPrice: 100
        },
        {
          customer: customerId,
          items: [{ product: productId2, quantity: 1 }],
          totalPrice: 50
        }
      ];

      axios.get.mockImplementation((url) => {
        const productId = url.split('/').pop();
        return Promise.resolve({
          data: { 
            _id: productId, 
            name: `Product ${productId}`, 
            price: 50 
          }
        });
      });

      await Order.insertMany(testOrders);

      const response = await request(app)
        .get(`/api/order/user/${customerId}`)
        .expect(200);

      expect(response.body.length).toBe(2);
      response.body.forEach(order => {
        expect(new mongoose.Types.ObjectId(order.customer)).toEqual(customerId);
        order.items.forEach(item => {
          expect(item.product).toHaveProperty('_id');
          expect(item.product).toHaveProperty('name');
        });
      });
    });

    it('should handle user with no orders', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/order/user/${nonExistentUserId}`)
        .expect(200);

      expect(response.body.length).toBe(0);
    });
  });

  describe('DELETE /api/order/:id', () => {
    it('should delete an existing order', async () => {
      const customerId = new mongoose.Types.ObjectId();
      const productId = new mongoose.Types.ObjectId();

      const testOrder = new Order({
        customer: customerId,
        items: [{ product: productId, quantity: 2 }],
        totalPrice: 100
      });
      await testOrder.save();

      const response = await request(app)
        .delete(`/api/order/${testOrder._id}`)
        .expect(200);

      expect(response.body.message).toBe('Đơn hàng đã được xóa thành công');

      const deletedOrder = await Order.findById(testOrder._id);
      expect(deletedOrder).toBeNull();
    });

    it('should handle deleting non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/order/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Không tìm thấy đơn hàng');
    });
  });

  describe('PATCH /api/order/purchase/:id', () => {
    it('should update order status to purchased', async () => {
      const customerId = new mongoose.Types.ObjectId();
      const productId = new mongoose.Types.ObjectId();

      const testOrder = new Order({
        customer: customerId,
        items: [{ product: productId, quantity: 2 }],
        totalPrice: 100,
        status: 'Pending'
      });
      await testOrder.save();

      const response = await request(app)
        .patch(`/api/order/purchase/${testOrder._id}`)
        .expect(200);

      expect(response.body.message).toBe('Đơn hàng đã được thanh toán');
      expect(response.body.order.status).toBe('Purchased');

      const updatedOrder = await Order.findById(testOrder._id);
      expect(updatedOrder.status).toBe('Purchased');
    });

    it('should handle purchasing non-existent order', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/order/purchase/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Không tìm thấy đơn hàng');
    });
  });
});