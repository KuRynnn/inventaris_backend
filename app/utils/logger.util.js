// app/utils/logger.js

const logger = {
    error: (message, meta = {}) => {
      console.error(`ERROR: ${message}`, meta);
    },
    warn: (message, meta = {}) => {
      console.warn(`WARN: ${message}`, meta);
    },
    info: (message, meta = {}) => {
      console.info(`INFO: ${message}`, meta);
    },
    debug: (message, meta = {}) => {
      console.debug(`DEBUG: ${message}`, meta);
    }
  };
  
  module.exports = logger;