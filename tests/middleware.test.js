const express = require('express');
const request = require('supertest');
const { asyncHandler, errorHandler } = require('../middleware/errorHandler');

const app = express();

// Rota de teste que gera erro
app.get('/test-error', asyncHandler(async (req, res) => {
  throw new Error('Erro de teste');
}));

// Rota de teste que gera erro com status
app.get('/test-status-error', asyncHandler(async (req, res) => {
  const error = new Error('Erro com status');
  error.statusCode = 400;
  throw error;
}));

// Rota de teste que funciona
app.get('/test-success', asyncHandler(async (req, res) => {
  res.json({ message: 'Sucesso' });
}));

app.use(errorHandler);

describe('🛡️ Testes de Middleware', () => {

  describe('AsyncHandler', () => {
    test('✅ Captura erro assíncrono', async () => {
      const res = await request(app).get('/test-error');
      expect(res.statusCode).toBe(500);
      expect(res.body.error).toBe('Erro de teste');
    });

    test('✅ Captura erro com status personalizado', async () => {
      const res = await request(app).get('/test-status-error');
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe('Erro com status');
    });

    test('✅ Permite execução normal', async () => {
      const res = await request(app).get('/test-success');
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Sucesso');
    });
  });

  describe('ErrorHandler', () => {
    test('✅ Trata erro sem statusCode', async () => {
      const res = await request(app).get('/test-error');
      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
    });

    test('✅ Trata erro com statusCode', async () => {
      const res = await request(app).get('/test-status-error');
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});