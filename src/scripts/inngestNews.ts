import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
import { chunkText } from "../utils/chunkText";
import { qdrantClient } from "../config/qdrant"


dotenv.config({
  path:"../../.env"
});



const parser = new Parser();

const FEEDS = [
  "https://www.theguardian.com/world/rss",
  "https://www.theguardian.com/business/rss",
  "https://www.theguardian.com/politics/rss",
];

const MAX_ARTICLES = 50;
const COLLECTION_NAME = "news_articles";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ---------------- TYPES ----------------

type Article = {
  title: string;
  content: string;
  url: string;
};

// ---------------- HELPERS ----------------

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function embedText(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function fetchGuardianArticle(url: string): Promise<Article | null> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(data);

    const title = $("h1").first().text().trim();

    const paragraphs: string[] = [];
    $("article p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 50) paragraphs.push(text);
    });

    const content = paragraphs.join("\n\n");

    if (!title || content.length < 500) return null;

    return { title, content, url };
  } catch {
    return null;
  }
}

// ---------------- MAIN PIPELINE ----------------

async function main() {
  const articles: Article[] = [];

  console.log("Starting RSS ingestion...");

  for (const feedUrl of FEEDS) {
    if (articles.length >= MAX_ARTICLES) break;

    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items) {
      if (articles.length >= MAX_ARTICLES) break;
      if (!item.link) continue;

      const article = await fetchGuardianArticle(item.link);

      if (article) {
        articles.push(article);
        console.log(`Parsed: ${article.title}`);
      }

      // Be polite to servers
      await sleep(500);
    }
  }

  console.log(`\nClean articles collected: ${articles.length}`);

  console.log("\nEmbedding & storing in Qdrant...");

  for (const article of articles) {
    const chunks = chunkText(article.content);

    for (const chunk of chunks) {
      const vector = await embedText(chunk);

      await qdrantClient.upsert(COLLECTION_NAME, {
        points: [
          {
            id: uuidv4(),
            vector,
            payload: {
              title: article.title,
              url: article.url,
              content: chunk,
            },
          },
        ],
      });
    }

    console.log(`Embedded: ${article.title}`);
  }

  console.log("\n Ingestion + embedding complete");
}

// ---------------- RUN ----------------

main().catch((err) => {
  console.error("Ingestion failed:", err);
  process.exit(1);
});
