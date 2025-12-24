import Parser from "rss-parser";
import axios from "axios";
import * as cheerio from "cheerio";

const parser = new Parser();

const FEEDS = [
  "https://www.theguardian.com/world/rss",
  "https://www.theguardian.com/business/rss",
];

const MAX_ARTICLES = 50;

type Article = {
  title: string;
  content: string;
  url: string;
};

async function fetchGuardianArticle(url: string): Promise<Article | null> {
  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
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

async function main() {
  const articles: Article[] = [];

  for (const feedUrl of FEEDS) {
    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items) {
      if (articles.length >= MAX_ARTICLES) break;
      if (!item.link) continue;

      const article = await fetchGuardianArticle(item.link);
      if (article) {
        articles.push(article);
        console.log(`Parsed: ${article.title}`);
      }
    }
  }

  console.log(`\n✅ Total clean articles: ${articles.length}`);
}

main();
