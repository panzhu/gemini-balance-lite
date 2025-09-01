/**
 * Token Bucket implementation for rate limiting
 */
export class TokenBucket {
  /**
   * @param {number} capacity - Maximum number of tokens in the bucket
   * @param {number} refillRate - Number of tokens added per second
   */
  constructor(capacity, refillRate) {
    this.capacity = capacity;
    this.tokens = capacity;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  /**
   * Attempt to consume tokens from the bucket
   * @param {number} count - Number of tokens to consume
   * @returns {boolean} - True if tokens were consumed, false otherwise
   */
  consume(count = 1) {
    this.refill();
    
    if (this.tokens >= count) {
      this.tokens -= count;
      return true;
    }
    
    return false;
  }

  /**
   * Add tokens to the bucket based on time elapsed
   */
  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000; // Convert to seconds
    this.lastRefill = now;
    
    // Add tokens based on refill rate and elapsed time
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
  }

  /**
   * Wait until enough tokens are available
   * @param {number} count - Number of tokens needed
   * @returns {Promise<void>}
   */
  async waitForTokens(count = 1) {
    while (!this.consume(count)) {
      // Calculate time to wait for next refill
      const tokensNeeded = count - this.tokens;
      const timeToWait = (tokensNeeded / this.refillRate) * 1000; // Convert to milliseconds
      
      // Wait for a minimum of 100ms to prevent busy waiting
      await new Promise(resolve => setTimeout(resolve, Math.max(100, timeToWait)));
    }
  }
}

// Create a default token bucket instance for rate limiting
// This can be configured with environment variables later
import { ENV_RATE_LIMIT_CAPACITY, ENV_RATE_LIMIT_REFILL_RATE, DEFAULT_RATE_LIMIT_CAPACITY, DEFAULT_RATE_LIMIT_REFILL_RATE } from './constants.js';

const capacity = parseInt(process.env[ENV_RATE_LIMIT_CAPACITY]) || DEFAULT_RATE_LIMIT_CAPACITY;
const refillRate = parseInt(process.env[ENV_RATE_LIMIT_REFILL_RATE]) || DEFAULT_RATE_LIMIT_REFILL_RATE;

export const defaultTokenBucket = new TokenBucket(capacity, refillRate);