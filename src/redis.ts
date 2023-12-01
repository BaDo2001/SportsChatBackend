import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";

export const pubSub = new RedisPubSub({
  publisher: new Redis(process.env.REDIS_URL!, {
    retryStrategy: (times) => Math.max(times * 100, 3000),
  }),
  subscriber: new Redis(process.env.REDIS_URL!, {
    retryStrategy: (times) => Math.max(times * 100, 3000),
  }),
});
