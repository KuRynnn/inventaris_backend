// app/middleware/errorHandler.middleware.js

const logger = require('../utils/logger.util');

function errorHandler(err, req, res, next) {
  logger.error(err.message, { stack: err.stack });

  const status = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  res.status(status).json({
    error: {
      message: message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

module.exports = errorHandler;