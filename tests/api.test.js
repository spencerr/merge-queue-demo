const request = require('supertest');
const app = require('../src/index');

describe('API Endpoints', () => {
  describe('GET /', () => {
    test('should return welcome message and endpoints', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('endpoints');
      expect(response.body.message).toBe('Welcome to the Merge Queue Demo API!');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(typeof response.body.uptime).toBe('number');
    });
  });

  describe('POST /api/calculate', () => {
    test('should calculate sum correctly', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({
          operation: 'sum',
          numbers: [1, 2, 3, 4, 5]
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        operation: 'sum',
        numbers: [1, 2, 3, 4, 5],
        result: 15
      });
    });

    test('should calculate product correctly', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({
          operation: 'product',
          numbers: [2, 3, 4]
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        operation: 'product',
        numbers: [2, 3, 4],
        result: 24
      });
    });

    test('should return 400 for invalid operation', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({
          operation: 'invalid',
          numbers: [1, 2, 3]
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for missing numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({
          operation: 'sum'
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    test('should return 400 for invalid numbers', async () => {
      const response = await request(app)
        .post('/api/calculate')
        .send({
          operation: 'sum',
          numbers: [1, 'invalid', 3]
        });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/sum', () => {
    test('should calculate sum correctly', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({
          numbers: [10, 20, 30]
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        operation: 'sum',
        numbers: [10, 20, 30],
        result: 60
      });
    });

    test('should handle empty array', async () => {
      const response = await request(app)
        .post('/api/sum')
        .send({
          numbers: []
        });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(0);
    });
  });

  describe('POST /api/product', () => {
    test('should calculate product correctly', async () => {
      const response = await request(app)
        .post('/api/product')
        .send({
          numbers: [2, 5, 3]
        });
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        operation: 'product',
        numbers: [2, 5, 3],
        result: 30
      });
    });

    test('should handle empty array', async () => {
      const response = await request(app)
        .post('/api/product')
        .send({
          numbers: []
        });
      
      expect(response.status).toBe(200);
      expect(response.body.result).toBe(1);
    });
  });

  describe('404 handler', () => {
    test('should return 404 for unknown routes', async () => {
      const response = await request(app).get('/unknown-route');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Not found');
    });
  });
});
