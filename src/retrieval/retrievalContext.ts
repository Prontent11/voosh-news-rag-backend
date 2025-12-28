import { qdrantClient } from "../config/qdrant";
import { embedText } from "../embeddings/geminiEmbedding";

const COLLECTION_NAME = "news_articles";

export async function retrieveContext(
  query: string,
  topK = 5
): Promise<string[]> {
  const queryVector = await embedText(query);

  const results = await qdrantClient.search(COLLECTION_NAME, {
    vector: queryVector,
    limit: topK,
  });

  return results.map(
    (point) => point.payload?.content as string
  );
}
