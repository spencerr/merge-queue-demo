const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { calculateSum, calculateProduct, validateNumber } = require('./utils');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Merge Queue Demo API!',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      calculate: '/api/calculate',
      sum: '/api/sum',
      product: '/api/product'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.post('/api/calculate', (req, res) => {
  try {
    const { operation, numbers } = req.body;
    
    if (!operation || !numbers || !Array.isArray(numbers)) {
      return res.status(400).json({
        error: 'Invalid request. Expected { operation: "sum" | "product", numbers: number[] }'
      });
    }

    // Validate all numbers
    for (const num of numbers) {
      if (!validateNumber(num)) {
        return res.status(400).json({
          error: `Invalid number: ${num}`
        });
      }
    }

    let result;
    switch (operation) {
      case 'sum':
        result = calculateSum(numbers);
        break;
      case 'product':
        result = calculateProduct(numbers);
        break;
      default:
        return res.status(400).json({
          error: 'Invalid operation. Supported operations: sum, product'
        });
    }

    res.json({
      operation,
      numbers,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/sum', (req, res) => {
  try {
    const { numbers } = req.body;
    
    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({
        error: 'Invalid request. Expected { numbers: number[] }'
      });
    }

    // Validate all numbers
    for (const num of numbers) {
      if (!validateNumber(num)) {
        return res.status(400).json({
          error: `Invalid number: ${num}`
        });
      }
    }

    const result = calculateSum(numbers);
    res.json({
      operation: 'sum',
      numbers,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

app.post('/api/product', (req, res) => {
  try {
    const { numbers } = req.body;
    
    if (!numbers || !Array.isArray(numbers)) {
      return res.status(400).json({
        error: 'Invalid request. Expected { numbers: number[] }'
      });
    }

    // Validate all numbers
    for (const num of numbers) {
      if (!validateNumber(num)) {
        return res.status(400).json({
          error: `Invalid number: ${num}`
        });
      }
    }

    const result = calculateProduct(numbers);
    res.json({
      operation: 'product',
      numbers,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong!'
  });
});

// Start server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
  });
}

module.exports = app;
