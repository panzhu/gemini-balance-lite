/**
 * Fetch with timeout
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
export async function fetchWithTimeout(url, options = {}, timeout = 10000) {
  // Create abort controller for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    // Add abort signal to options
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    // Clear timeout if request completes
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeoutId);
    
    // Check if error was due to timeout
    if (error.name === 'AbortError') {
      // Create a custom error for timeout
      const timeoutError = new Error('Request timeout');
      timeoutError.name = 'TimeoutError';
      throw timeoutError;
    }
    
    // Re-throw other errors
    throw error;
  }
}