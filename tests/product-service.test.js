const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/product');
const productRoutes = require('../routes/product');

jest.setTimeout(30000);

describe('Product Service API', () => {
  let app;
  let mongoServer;
  
  beforeAll(async () => {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    app = express();
    app.use(express.json());
    app.use('/api/product', productRoutes);

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
    await Product.deleteMany({});
  });

  describe('POST /api/product', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'A test product description',
        price: 100,
        quantity: 50,
        category: 'Test Category',
        image: 'test-image-url',
        ingredients: 'Test ingredients',
        factory: 'Test Factory',
        country: 'Test Country',
        unit: 'piece'
      };

      const response = await request(app)
        .post('/api/product')
        .send(productData)
        .expect(201);

      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.quantity).toBe(productData.quantity);
      expect(response.body.category).toBe(productData.category);
      expect(response.body.image).toBe(productData.image);
      expect(response.body.ingredients).toBe(productData.ingredients);
      expect(response.body.factory).toBe(productData.factory);
      expect(response.body.country).toBe(productData.country);
      expect(response.body.unit).toBe(productData.unit);

      const savedProduct = await Product.findById(response.body._id);
      expect(savedProduct).toBeTruthy();
    });

    it('should handle product creation errors', async () => {
      const invalidProductData = {
        name: 'Incomplete Product'
      };

      const response = await request(app)
        .post('/api/product')
        .send(invalidProductData)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/product', () => {
    it('should fetch all products', async () => {
      const testProducts = [
        {
          name: 'Product 1',
          description: 'Description 1',
          price: 100,
          quantity: 50,
          category: 'Category 1',
          image: 'image-url-1',
          ingredients: 'Ingredients 1',
          factory: 'Factory 1',
          country: 'Country 1',
          unit: 'piece'
        },
        {
          name: 'Product 2',
          description: 'Description 2',
          price: 200,
          quantity: 25,
          category: 'Category 2',
          image: 'image-url-2',
          ingredients: 'Ingredients 2',
          factory: 'Factory 2',
          country: 'Country 2',
          unit: 'kg'
        }
      ];

      await Product.insertMany(testProducts);

      const response = await request(app)
        .get('/api/product')
        .expect(201);

      expect(response.body.length).toBe(2);

      response.body.forEach((product, index) => {
        expect(product.name).toBe(testProducts[index].name);
        expect(product.description).toBe(testProducts[index].description);
        expect(product.price).toBe(testProducts[index].price);
      });
    });

    it('should return empty array when no products exist', async () => {
      const response = await request(app)
        .get('/api/product')
        .expect(201);

      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /api/product/:id', () => {
    it('should fetch a specific product by ID', async () => {
      const testProduct = new Product({
        name: 'Specific Product',
        description: 'A specific product description',
        price: 150,
        quantity: 75,
        category: 'Special Category',
        image: 'specific-image-url',
        ingredients: 'Special ingredients',
        factory: 'Special Factory',
        country: 'Special Country',
        unit: 'pack'
      });
      await testProduct.save();

      const response = await request(app)
        .get(`/api/product/${testProduct._id}`)
        .expect(200);

      expect(response.body.name).toBe(testProduct.name);
      expect(response.body.description).toBe(testProduct.description);
      expect(response.body.price).toBe(testProduct.price);
      expect(response.body._id).toBe(testProduct._id.toString());
    });

    it('should handle fetching non-existent product', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/product/${fakeId}`)
        .expect(404);

      expect(response.body.message).toBe('Product not found');
    });
  });
});