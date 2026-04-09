const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  retryStrategy: (options) => {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      console.log('⚠️ Redis not available - caching disabled (optional feature)');
      return new Error('Redis connection failed');
    }
  }
});

client.on('error', (err) => {
  console.log('⚠️ Redis error:', err.message);
});

client.on('connect', () => {
  console.log('✅ Redis connected');
});

// Cache middleware
const cacheKey = (key) => `apartment-system:${key}`;

const cacheGet = (key) => {
  return new Promise((resolve, reject) => {
    client.get(cacheKey(key), (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(data ? JSON.parse(data) : null);
      }
    });
  });
};

const cacheSet = (key, value, ttl = 3600) => {
  return new Promise((resolve, reject) => {
    client.setex(cacheKey(key), ttl, JSON.stringify(value), (err) => {
      if (err) {
        console.log('⚠️ Cache set failed');
        resolve();
      } else {
        resolve();
      }
    });
  });
};

const cacheDel = (key) => {
  return new Promise((resolve, reject) => {
    client.del(cacheKey(key), (err) => {
      if (err) {
        resolve();
      } else {
        resolve();
      }
    });
  });
};

const cacheFlush = () => {
  return new Promise((resolve, reject) => {
    client.flushdb((err) => {
      if (err) {
        resolve();
      } else {
        console.log('✅ Cache cleared');
        resolve();
      }
    });
  });
};

module.exports = {
  client,
  cacheGet,
  cacheSet,
  cacheDel,
  cacheFlush
};
