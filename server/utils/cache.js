const NodeCache = require("node-cache");

/**
 * Cache utility for improving performance
 * Uses in-memory caching for frequently accessed data
 */
class CacheService {
  constructor(ttlSeconds = 3600) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds, // Default TTL (1 hour)
      checkperiod: ttlSeconds * 0.2, // Check for expired keys every 20% of TTL
      useClones: false, // For better performance
    });
  }

  /**
   * Get an item from the cache
   * @param {string} key - Cache key
   * @returns {any} Cached item or undefined if not found
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Set an item in the cache
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (optional, uses default if not provided)
   * @returns {boolean} Success status
   */
  set(key, value, ttl = undefined) {
    return this.cache.set(key, value, ttl);
  }

  /**
   * Delete an item from the cache
   * @param {string} key - Cache key
   * @returns {number} Number of deleted entries
   */
  del(key) {
    return this.cache.del(key);
  }

  /**
   * Flush the entire cache
   * @returns {void}
   */
  flush() {
    return this.cache.flushAll();
  }

  /**
   * Get or set cache value with a callback
   * If key exists in cache, returns the cached value
   * If not, calls the callback, caches the result, and returns it
   *
   * @param {string} key - Cache key
   * @param {number} ttl - Time to live in seconds (optional)
   * @param {Function} callback - Async function to call if item is not in cache
   * @returns {Promise<any>} Result from cache or callback
   */
  async getOrSet(key, ttl, callback) {
    // Handle case where ttl is omitted
    if (typeof ttl === "function") {
      callback = ttl;
      ttl = undefined;
    }

    const value = this.get(key);
    if (value !== undefined) {
      return value;
    }

    try {
      const result = await callback();
      this.set(key, result, ttl);
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Clear cache for items with keys matching a pattern
   * @param {string} pattern - String pattern to match in keys
   * @returns {number} Number of deleted keys
   */
  clearPattern(pattern) {
    if (!pattern) return 0;

    const regex = new RegExp(pattern);
    const keys = this.cache.keys();
    let deleted = 0;

    keys.forEach((key) => {
      if (regex.test(key)) {
        this.cache.del(key);
        deleted++;
      }
    });

    return deleted;
  }
}

// Export singleton instance
module.exports = new CacheService();
