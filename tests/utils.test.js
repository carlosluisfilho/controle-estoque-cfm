const { formatDate } = require('../utils/dateUtils');
const { validateRequired, validatePositiveNumber } = require('../utils/validationUtils');

describe('🛠️ Testes de Utilitários', () => {

  describe('DateUtils', () => {
    test('✅ Formata data corretamente', () => {
      const data = '2025-04-01T10:30:00.000Z';
      const resultado = formatDate(data);
      expect(resultado).toBe('01-04-2025');
    });

    test('✅ Retorna string vazia para data inválida', () => {
      const resultado = formatDate(null);
      expect(resultado).toBe('');
    });
  });

  describe('ValidationUtils', () => {
    test('✅ Valida campo obrigatório', () => {
      expect(() => validateRequired('teste', 'Campo')).not.toThrow();
      expect(() => validateRequired('', 'Campo')).toThrow('Campo é obrigatório');
      expect(() => validateRequired(null, 'Campo')).toThrow('Campo é obrigatório');
    });

    test('✅ Valida número positivo', () => {
      expect(() => validatePositiveNumber(10, 'Número')).not.toThrow();
      expect(() => validatePositiveNumber(0, 'Número')).toThrow('Número deve ser positivo');
      expect(() => validatePositiveNumber(-5, 'Número')).toThrow('Número deve ser positivo');
    });
  });
});