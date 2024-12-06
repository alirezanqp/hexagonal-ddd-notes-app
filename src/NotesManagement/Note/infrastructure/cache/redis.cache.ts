import { Injectable, Logger } from '@nestjs/common';
import Redis, { RedisOptions } from 'ioredis';

import { Cache } from '../../application/ports/cache.port';
import { redisConfig } from '@common/infrastructure/configs/redis.config';

@Injectable()
export class RedisCache implements Cache {
  private readonly logger = new Logger(RedisCache.name);
  private readonly cacheClient: Redis;

  constructor() {
    const redis: RedisOptions = {
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
    };

    try {
      this.cacheClient = new Redis(redis);

      this.cacheClient.on('error', (error) => {
        this.logger.error('Redis connection error', error.stack);
      });
    } catch (error) {
      this.logger.error('Failed to create Redis client', error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const cachedValue = await this.cacheClient.get(key);

      if (cachedValue === null) {
        return null;
      }

      try {
        return JSON.parse(cachedValue) as T;
      } catch {
        return cachedValue as T;
      }
    } catch (error) {
      this.logger.error(`Error retrieving key ${key} from Redis`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const valueToStore =
        typeof value === 'string' ? value : JSON.stringify(value);

      if (ttl) {
        await this.cacheClient.setex(key, ttl, valueToStore);
      } else {
        await this.cacheClient.set(key, valueToStore);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key} in Redis`, error);
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.cacheClient.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from Redis`, error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await this.cacheClient.flushdb();
    } catch (error) {
      this.logger.error('Error clearing Redis database', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.cacheClient.quit();
    } catch (error) {
      this.logger.error('Error closing Redis connection', error);
    }
  }
}
