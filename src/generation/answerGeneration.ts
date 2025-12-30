import genAI from "../config/genAI";
import dotenv from 'dotenv'

dotenv.config();



export async function generateAnswer(
  question: string,
  contextChunks: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model:'gemini-2.5-flash'
  });

  const context = contextChunks
    .map((chunk, i) => `Source ${i + 1}:\n${chunk}`)
    .join("\n\n");

  const prompt = `
You are a news assistant.
Answer the user's question using ONLY the information from the sources below.
If the answer is not contained in the sources, say you don't know.
If the question is related to your introduction or greeting you so do greet and tell who you are and here you can provide news.

Sources:
${context}

Question:
${question}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response.trim();
}
