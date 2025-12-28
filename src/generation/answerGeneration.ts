import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function generateAnswer(
  question: string,
  contextChunks: string[]
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
  });

  const context = contextChunks
    .map((chunk, i) => `Source ${i + 1}:\n${chunk}`)
    .join("\n\n");

  const prompt = `
You are a news assistant.
Answer the user's question using ONLY the information from the sources below.
If the answer is not contained in the sources, say you don't know.

Sources:
${context}

Question:
${question}
`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  return response.trim();
}
