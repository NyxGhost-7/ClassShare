import {Redis} from "@upstash/redis";
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})
console.log("Redis connecteddd")
export default redis