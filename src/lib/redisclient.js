import { createClient } from "redis";

const globalForRedis = globalThis;

export const redis =
  globalForRedis.redis ||
  createClient({
    url: process.env.REDIS_URL,
  });
// console.log("redis client")
if (!globalForRedis.redis) {
  globalForRedis.redis = redis;
}

let connectingPromise = null;

export async function connectRedis() {
  if (redis.isOpen) {
    return redis;
  }

  if (!connectingPromise) {
    connectingPromise = redis.connect().catch((error) => {
      connectingPromise = null;
      throw error;
    });
  }

  await connectingPromise;

  return redis;
}
console.log("redisclient connected")