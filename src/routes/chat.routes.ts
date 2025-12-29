import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  handleChat,
  getHistory,
  resetSession,
} from "../chat/chatService";

const router = Router();

router.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const id = sessionId || uuidv4();
  const answer = await handleChat(id, message);

  res.json({
    sessionId: id,
    answer,
  });
});

router.get("/history/:sessionId", async (req, res) => {
  const history = await getHistory(req.params.sessionId);
  res.json(history);
});

router.delete("/reset/:sessionId", async (req, res) => {
  await resetSession(req.params.sessionId);
  res.json({ status: "reset" });
});

export default router;
