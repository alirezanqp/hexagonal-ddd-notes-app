export interface Cache {
  /**
   * Get an item from the cache
   * @param key - Unique cache key
   * @returns Cached value or null if not found
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Set an item in the cache
   * @param key - Unique cache key
   * @param value - Value to cache
   * @param ttl - Time to live in seconds (optional)
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Delete an item from the cache
   * @param key - Unique cache key
   */
  delete(key: string): Promise<void>;

  /**
   * Clear all cache entries
   */
  clear(): Promise<void>;
}

export const Cache = Symbol('Cache');

// Cache key generators for different entities
export class CacheKeyGenerator {
  static notesByUser(userId: string): string {
    return `notes:user:${userId}`;
  }

  static notebookById(notebookId: string): string {
    return `notebook:${notebookId}`;
  }

  static notebooksByUser(userId: string): string {
    return `notebooks:user:${userId}`;
  }
}
