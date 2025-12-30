import { QdrantClient } from "@qdrant/js-client-rest";
import dotenv from 'dotenv'

dotenv.config();

const QDRANT_URL = process.env.QDRANT_URL 
const QDRANT_KEY=process.env.QDRANT_KEY


export const qdrantClient = new QdrantClient({
  url: QDRANT_URL,
  apiKey:QDRANT_KEY
});


//create collection named news_articles
//size: 768 - >Gemini embedding dimension

async function createCollection() {
  await qdrantClient.createCollection("news_articles", {
    vectors: {
      size: 768,
      distance: "Cosine",
    },
  });

  console.log("Collection created with 768-dim vectors");
}

// createCollection();
