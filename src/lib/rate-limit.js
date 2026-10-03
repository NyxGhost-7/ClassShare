import { Redis,connectRedis } from "./redisclient";

const RATE_LIMIT_SCRIPT = `
local current = redis.call("INCR", KEYS[1])

if current == 1 then
    redis.call("EXPIRE", KEYS[1], ARGV[1])
end

local ttl = redis.call("TTL", KEYS[1])

if current > tonumber(ARGV[2]) then
    return {0, current, ttl}
end

return {1, current, ttl}
`;

export async function rateLimit({
  key,
  limit,
  windowSeconds,
}) {
  const redis = await connectRedis();

  const result = await redis.eval(RATE_LIMIT_SCRIPT, {
    keys: [key],
    arguments: [
      String(windowSeconds),
      String(limit),
    ],
  });

  const allowed = Number(result[0]) === 1;
  const count = Number(result[1]);
  const retryAfter = Number(result[2]);

  return {
    allowed,
    count,
    remaining: Math.max(0, limit - count),
    retryAfter,
  };
}