import genAI from "../config/genAI";

export async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(text);
  return result.embedding.values;
}
