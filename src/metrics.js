/**
 * Basic metrics collection for monitoring
 */

// Metrics counters
let requestCount = 0;
let successCount = 0;
let errorCount = 0;
let requestDurations = [];

/**
 * Record a request
 * @param {boolean} success - Whether the request was successful
 * @param {number} duration - Request duration in milliseconds
 */
export function recordRequest(success, duration) {
  requestCount++;
  if (success) {
    successCount++;
  } else {
    errorCount++;
  }
  requestDurations.push(duration);
  
  // Keep only the last 1000 durations to prevent memory growth
  if (requestDurations.length > 1000) {
    requestDurations = requestDurations.slice(-1000);
  }
}

/**
 * Get metrics summary
 * @returns {Object} Metrics summary
 */
export function getMetricsSummary() {
  const averageDuration = requestDurations.length > 0
    ? requestDurations.reduce((sum, dur) => sum + dur, 0) / requestDurations.length
    : 0;
  
  return {
    totalRequests: requestCount,
    successfulRequests: successCount,
    errorRequests: errorCount,
    successRate: requestCount > 0 ? successCount / requestCount : 0,
    averageResponseTime: averageDuration,
    last1000Durations: requestDurations.slice(-1000)
  };
}

/**
 * Middleware to record request metrics
 * @param {Function} handler - Request handler function
 * @returns {Function} Wrapped handler with metrics
 */
export function withMetrics(handler) {
  return async (request) => {
    const startTime = Date.now();
    let success = false;
    
    try {
      const response = await handler(request);
      success = response.status < 400;
      return response;
    } finally {
      const duration = Date.now() - startTime;
      recordRequest(success, duration);
    }
  };
}