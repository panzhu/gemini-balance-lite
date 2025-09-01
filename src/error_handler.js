/**
 * Error categorization and logging utility
 */

// Error categories
export const ERROR_CATEGORIES = {
  NETWORK: 'network_error',
  AUTH: 'authentication_error',
  RATE_LIMIT: 'rate_limit_error',
  SERVER: 'server_error',
  VALIDATION: 'validation_error',
  TIMEOUT: 'timeout_error',
  UNKNOWN: 'unknown_error'
};

/**
 * Categorize errors based on their properties
 * @param {Error} error - The error to categorize
 * @returns {string} - The error category
 */
export function categorizeError(error) {
  // Check for specific error types
  if (error.name === 'HttpError') {
    if (error.status === 401 || error.status === 403) {
      return ERROR_CATEGORIES.AUTH;
    }
    if (error.status === 429) {
      return ERROR_CATEGORIES.RATE_LIMIT;
    }
    if (error.status >= 400 && error.status < 500) {
      return ERROR_CATEGORIES.VALIDATION;
    }
    if (error.status >= 500) {
      return ERROR_CATEGORIES.SERVER;
    }
  }
  
  // Check for network-related errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return ERROR_CATEGORIES.NETWORK;
  }
  
  // Check for timeout errors
  if (error.name === 'TimeoutError' || error.message.includes('timeout')) {
    return ERROR_CATEGORIES.TIMEOUT;
  }
  
  // Default to unknown error
  return ERROR_CATEGORIES.UNKNOWN;
}

/**
 * Log error with context and categorization
 * @param {Error} error - The error to log
 * @param {string} context - Context where the error occurred
 * @param {Object} additionalInfo - Additional information to log
 */
export function logError(error, context, additionalInfo = {}) {
  const category = categorizeError(error);
  
  // Create structured log object
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    category,
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    ...additionalInfo
  };
  
  // Log based on category
  switch (category) {
    case ERROR_CATEGORIES.AUTH:
    case ERROR_CATEGORIES.VALIDATION:
      console.warn(JSON.stringify(logEntry));
      break;
    case ERROR_CATEGORIES.RATE_LIMIT:
    case ERROR_CATEGORIES.NETWORK:
    case ERROR_CATEGORIES.TIMEOUT:
      console.warn(JSON.stringify(logEntry));
      break;
    case ERROR_CATEGORIES.SERVER:
    case ERROR_CATEGORIES.UNKNOWN:
      console.error(JSON.stringify(logEntry));
      break;
    default:
      console.error(JSON.stringify(logEntry));
  }
}