import { redis } from "../server/redis";

interface RateLimitOptions {
  key: string;
  limit: number;
  window: number;
}

export const rateLimiter = async ({ key, limit, window }: RateLimitOptions) => {
  const now = Date.now();
  const windowStart = now - window * 1000;

  const pipeline = redis.pipeline();

  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zadd(key, now, now.toString());
  pipeline.zcard(key);
  pipeline.expire(key, window);

  const results = await pipeline.exec();

  if (!results) {
    return { success: true, remaining: limit };
  }

  const countResult = results[2]?.[1] as number;

  return {
    success: countResult <= limit,
    remaining: Math.max(0, limit - countResult),
  };
};
