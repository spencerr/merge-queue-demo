const {
  validateNumber,
  calculateSum,
  calculateProduct,
  calculateAverage,
  findMax,
  findMin
} = require('../src/utils');

describe('Utils Functions', () => {
  describe('validateNumber', () => {
    test('should return true for valid numbers', () => {
      expect(validateNumber(5)).toBe(true);
      expect(validateNumber(0)).toBe(true);
      expect(validateNumber(-10)).toBe(true);
      expect(validateNumber(3.14)).toBe(true);
    });

    test('should return false for invalid values', () => {
      expect(validateNumber('5')).toBe(false);
      expect(validateNumber(NaN)).toBe(false);
      expect(validateNumber(Infinity)).toBe(false);
      expect(validateNumber(-Infinity)).toBe(false);
      expect(validateNumber(null)).toBe(false);
      expect(validateNumber(undefined)).toBe(false);
      expect(validateNumber({})).toBe(false);
      expect(validateNumber([])).toBe(false);
    });
  });

  describe('calculateSum', () => {
    test('should calculate sum correctly', () => {
      expect(calculateSum([1, 2, 3, 4, 5])).toBe(15);
      expect(calculateSum([10, -5, 3])).toBe(8);
      expect(calculateSum([0, 0, 0])).toBe(0);
      expect(calculateSum([42])).toBe(42);
    });

    test('should return 0 for empty array', () => {
      expect(calculateSum([])).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculateSum([1.5, 2.5, 3.0])).toBe(7);
      expect(calculateSum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
    });

    test('should throw error for non-array input', () => {
      expect(() => calculateSum('not an array')).toThrow('Input must be an array');
      expect(() => calculateSum(123)).toThrow('Input must be an array');
      expect(() => calculateSum(null)).toThrow('Input must be an array');
    });

    test('should throw error for invalid numbers in array', () => {
      expect(() => calculateSum([1, 2, 'invalid', 4])).toThrow('Invalid number: invalid');
      expect(() => calculateSum([1, NaN, 3])).toThrow('Invalid number: NaN');
    });
  });

  describe('calculateProduct', () => {
    test('should calculate product correctly', () => {
      expect(calculateProduct([2, 3, 4])).toBe(24);
      expect(calculateProduct([5, -2])).toBe(-10);
      expect(calculateProduct([1, 1, 1, 1])).toBe(1);
      expect(calculateProduct([7])).toBe(7);
    });

    test('should return 1 for empty array', () => {
      expect(calculateProduct([])).toBe(1);
    });

    test('should handle zero in array', () => {
      expect(calculateProduct([1, 2, 0, 4])).toBe(0);
    });

    test('should handle decimal numbers', () => {
      expect(calculateProduct([2.5, 4])).toBe(10);
      expect(calculateProduct([0.5, 0.5])).toBe(0.25);
    });

    test('should throw error for non-array input', () => {
      expect(() => calculateProduct('not an array')).toThrow('Input must be an array');
      expect(() => calculateProduct(123)).toThrow('Input must be an array');
    });

    test('should throw error for invalid numbers in array', () => {
      expect(() => calculateProduct([1, 2, 'invalid', 4])).toThrow('Invalid number: invalid');
    });
  });

  describe('calculateAverage', () => {
    test('should calculate average correctly', () => {
      expect(calculateAverage([1, 2, 3, 4, 5])).toBe(3);
      expect(calculateAverage([10, 20])).toBe(15);
      expect(calculateAverage([100])).toBe(100);
    });

    test('should handle decimal results', () => {
      expect(calculateAverage([1, 2])).toBe(1.5);
      expect(calculateAverage([1, 2, 3])).toBeCloseTo(2);
    });

    test('should throw error for empty array', () => {
      expect(() => calculateAverage([])).toThrow('Cannot calculate average of empty array');
    });

    test('should throw error for non-array input', () => {
      expect(() => calculateAverage('not an array')).toThrow('Input must be an array');
    });
  });

  describe('findMax', () => {
    test('should find maximum value correctly', () => {
      expect(findMax([1, 5, 3, 9, 2])).toBe(9);
      expect(findMax([-1, -5, -3])).toBe(-1);
      expect(findMax([42])).toBe(42);
    });

    test('should handle decimal numbers', () => {
      expect(findMax([1.1, 1.9, 1.5])).toBe(1.9);
    });

    test('should throw error for empty array', () => {
      expect(() => findMax([])).toThrow('Cannot find max of empty array');
    });

    test('should throw error for non-array input', () => {
      expect(() => findMax('not an array')).toThrow('Input must be an array');
    });
  });

  describe('findMin', () => {
    test('should find minimum value correctly', () => {
      expect(findMin([1, 5, 3, 9, 2])).toBe(1);
      expect(findMin([-1, -5, -3])).toBe(-5);
      expect(findMin([42])).toBe(42);
    });

    test('should handle decimal numbers', () => {
      expect(findMin([1.1, 1.9, 1.5])).toBe(1.1);
    });

    test('should throw error for empty array', () => {
      expect(() => findMin([])).toThrow('Cannot find min of empty array');
    });

    test('should throw error for non-array input', () => {
      expect(() => findMin('not an array')).toThrow('Input must be an array');
    });
  });
});
