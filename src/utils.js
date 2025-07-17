/**
 * Validates if a value is a valid number
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is a valid number
 */
function validateNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Calculates the sum of an array of numbers
 * @param {number[]} numbers - Array of numbers to sum
 * @returns {number} - The sum of all numbers
 * @throws {Error} - If the input is not an array or contains invalid numbers
 */
function calculateSum(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  if (numbers.length === 0) {
    return 0;
  }
  
  return numbers.reduce((sum, num) => {
    if (!validateNumber(num)) {
      throw new Error(`Invalid number: ${num}`);
    }
    return sum + num;
  }, 0);
}

/**
 * Calculates the product of an array of numbers
 * @param {number[]} numbers - Array of numbers to multiply
 * @returns {number} - The product of all numbers
 * @throws {Error} - If the input is not an array or contains invalid numbers
 */
function calculateProduct(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  if (numbers.length === 0) {
    return 1; // Mathematical identity for multiplication
  }
  
  return numbers.reduce((product, num) => {
    if (!validateNumber(num)) {
      throw new Error(`Invalid number: ${num}`);
    }
    return product * num;
  }, 1);
}

/**
 * Calculates the average of an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} - The average of all numbers
 * @throws {Error} - If the input is not an array, is empty, or contains invalid numbers
 */
function calculateAverage(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  if (numbers.length === 0) {
    throw new Error('Cannot calculate average of empty array');
  }
  
  const sum = calculateSum(numbers);
  return sum / numbers.length;
}

/**
 * Finds the maximum value in an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} - The maximum value
 * @throws {Error} - If the input is not an array, is empty, or contains invalid numbers
 */
function findMax(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  if (numbers.length === 0) {
    throw new Error('Cannot find max of empty array');
  }
  
  return numbers.reduce((max, num) => {
    if (!validateNumber(num)) {
      throw new Error(`Invalid number: ${num}`);
    }
    return Math.max(max, num);
  }, -Infinity);
}

/**
 * Finds the minimum value in an array of numbers
 * @param {number[]} numbers - Array of numbers
 * @returns {number} - The minimum value
 * @throws {Error} - If the input is not an array, is empty, or contains invalid numbers
 */
function findMin(numbers) {
  if (!Array.isArray(numbers)) {
    throw new Error('Input must be an array');
  }
  
  if (numbers.length === 0) {
    throw new Error('Cannot find min of empty array');
  }
  
  return numbers.reduce((min, num) => {
    if (!validateNumber(num)) {
      throw new Error(`Invalid number: ${num}`);
    }
    return Math.min(min, num);
  }, Infinity);
}

module.exports = {
  validateNumber,
  calculateSum,
  calculateProduct,
  calculateAverage,
  findMax,
  findMin
};
