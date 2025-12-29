import { redisClient } from "../config/redis";
import { generateAnswer } from "../generation/answerGeneration";
import { retrieveContext } from "../retrieval/retrievalContext";

const SESSION_TTL = 60 * 30; 

type Message = {
  role: "user" | "assistant";
  content: string;
};

export async function handleChat(
  sessionId: string,
  userMessage: string
) {
  const historyKey = `chat:${sessionId}`;

 
  await redisClient.rPush(
    historyKey,
    JSON.stringify({ role: "user", content: userMessage })
  );

  
  const context = await retrieveContext(userMessage);
  const answer = await generateAnswer(userMessage, context);

  
  await redisClient.rPush(
    historyKey,
    JSON.stringify({ role: "assistant", content: answer })
  );

  
  await redisClient.expire(historyKey, SESSION_TTL);

  return answer;
}

export async function getHistory(sessionId: string): Promise<Message[]> {
  const historyKey = `chat:${sessionId}`;
  const messages = await redisClient.lRange(historyKey, 0, -1);

  return messages.map((m) => JSON.parse(m));
}

export async function resetSession(sessionId: string) {
  const historyKey = `chat:${sessionId}`;
  await redisClient.del(historyKey);
}
