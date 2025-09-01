/**
 * Constants used throughout the application
 */

// API and Service Constants
export const GEMINI_API_BASE_URL = 'https://generativelanguage.googleapis.com';
export const GEMINI_API_VERSION = 'v1beta';

// Timeout and Rate Limiting
export const DEFAULT_FETCH_TIMEOUT = 30000; // 30 seconds
export const DEFAULT_RATE_LIMIT_CAPACITY = 10;
export const DEFAULT_RATE_LIMIT_REFILL_RATE = 5;

// Paths and Endpoints
export const ROOT_PATHS = ['/', '/index.html'];
export const VERIFY_PATH = '/verify';
export const OPENAI_ENDPOINTS = [
  '/chat/completions',
  '/completions',
  '/embeddings',
  '/models'
];

// Response Messages
export const ROOT_RESPONSE_MESSAGE = 'Proxy is Running! More Details: https://github.com/tech-shrimp/gemini-balance-lite';
export const NETWORK_ERROR_MESSAGE = 'Network Error: Unable to reach Gemini API';
export const AUTH_ERROR_MESSAGE = 'Authentication Error: Invalid API Key';
export const RATE_LIMIT_ERROR_MESSAGE = 'Rate Limit Exceeded: Too many requests';
export const VALIDATION_ERROR_MESSAGE = 'Bad Request: Invalid request parameters';
export const TIMEOUT_ERROR_MESSAGE = 'Request Timeout: The request took too long';

// Environment Variable Names
export const ENV_FETCH_TIMEOUT = 'FETCH_TIMEOUT';
export const ENV_RATE_LIMIT_CAPACITY = 'RATE_LIMIT_CAPACITY';
export const ENV_RATE_LIMIT_REFILL_RATE = 'RATE_LIMIT_REFILL_RATE';
export const ENV_MODELS_CACHE_TTL = 'MODELS_CACHE_TTL';
export const ENV_REQUEST_LOGGING = 'REQUEST_LOGGING';

// Cache and other defaults
export const DEFAULT_MODELS_CACHE_TTL = 3600000; // 1 hour