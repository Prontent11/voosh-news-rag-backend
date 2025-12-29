import express from "express";
import dotenv from 'dotenv';
import { connectRedis } from "./config/redis";
import chatRoutes from './routes/chat.routes'
dotenv.config({path:'../.env'});

const app = express();
const PORT = process.env.SERVER_PORT;

app.use("/api",chatRoutes)

app.get("/health", (_req, res) => {
  res.send("working...");
});

async function main() {
  await connectRedis();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
