import { createClient } from "redis";
import dotenv from "dotenv";
import path from 'path'

dotenv.config();

if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is not set in environment variables");
}
export const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}
