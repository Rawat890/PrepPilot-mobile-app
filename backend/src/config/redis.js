import { createClient } from 'redis';

let redisClient = null;
let isRedisConnected = false;

export const initRedis = async () => {
  if (process.env.USE_REDIS !== 'true') {
    console.log('Redis caching disabled via env (using in-memory fallback)');
    return null;
  }

  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    });

    redisClient.on('error', (err) => {
      console.warn('Redis Client Warning:', err.message);
      isRedisConnected = false;
    });

    await redisClient.connect();
    isRedisConnected = true;
    console.log('Redis Connected Successfully');
    return redisClient;
  } catch (error) {
    console.warn('Redis unavailable, falling back to memory cache:', error.message);
    isRedisConnected = false;
    return null;
  }
};

// Simple fallback memory store when Redis is not running locally
const memoryCache = new Map();

export const getCache = async (key) => {
  try {
    if (isRedisConnected && redisClient) {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    }
    const item = memoryCache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      memoryCache.delete(key);
      return null;
    }
    return item.value;
  } catch {
    return null;
  }
};

export const setCache = async (key, value, ttlSeconds = 3600) => {
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      return;
    }
    memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    });
  } catch {
    // Fail silently on cache write
  }
};

export const deleteCache = async (key) => {
  try {
    if (isRedisConnected && redisClient) {
      await redisClient.del(key);
      return;
    }
    memoryCache.delete(key);
  } catch {
    // Fail silently
  }
};
