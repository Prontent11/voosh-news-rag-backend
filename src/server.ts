import path from "path";
import dotenv from "dotenv";

import express from "express";
import cors from "cors";
import { connectRedis } from "./config/redis"; 
import chatRoutes from './routes/chat.routes'

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", chatRoutes);

app.get("/health", (_req, res) => {
  res.send("working...");
});

const PORT = process.env.PORT || 5000;

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
