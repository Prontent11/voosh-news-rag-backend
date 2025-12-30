# 📰 News RAG Chatbot — Backend

A production-ready backend for a **Retrieval-Augmented Generation (RAG)** chatbot that answers questions using **recent news articles**.

The system ingests news data, generates embeddings using **Gemini**, stores vectors in **Qdrant**, and serves grounded responses through a **session-based chat API** backed by **Upstash Redis**.

---

## 🚀 Key Features

### 🔎 Retrieval-Augmented Generation (RAG)
- Offline ingestion of news articles
- Text chunking and vector embeddings
- Semantic search using Qdrant
- Context-grounded answer generation

### 💬 Chat API
- Session-based conversations
- Redis-backed chat history
- Resettable chat sessions

### 🧠 Hallucination-Safe by Design
- The LLM answers **only from retrieved context**
- If information is not present, the system responds with *"I don't know"*
- Small talk and identity questions are routed outside the RAG pipeline

### ☁️ Cloud Ready
- Qdrant Cloud for vector storage
- Upstash Redis for session management
- Fully environment-driven configuration
- Deployed on Render

---

## 🏗️ High-Level Architecture

```
User Query
    │
    ▼
[ Express API ]
    │
    │
    └─ Knowledge Query
         │
         ▼
   [ Gemini Embeddings ]
         │
         ▼
   [ Qdrant Vector Search ]
         │
         ▼
   [ Relevant Context ]
         │
         ▼
   [ Gemini 1.5 Flash ]
         │
         ▼
   Grounded Answer
```

---

## 🛠️ Tech Stack

| Layer              | Technology                    |
|--------------------|-------------------------------|
| Language           | TypeScript                    |
| Runtime            | Node.js                       |
| Web Framework      | Express                       |
| Vector Database    | Qdrant Cloud                  |
| Cache / Sessions   | Redis (Upstash)               |
| Embeddings         | Gemini `text-embedding-004`   |
| LLM                | Gemini `2.5-flash`            |
| Deployment         | Render                        |

---

## 📁 Project Structure

```
src/
├─ chat/
│  └─ chatService.ts          # Chat orchestration & session handling
│
├─ embeddings/
│  └─ geminiEmbedding.ts      # Gemini embedding logic
│
├─ generation/
│  └─ answerGeneration.ts         # Answer generation using LLM
│
├─ retrieval/
│  └─ retrieveContext.ts      # Vector search logic (Qdrant)
│
├─ scripts/
│  └─ inngestNews.ts       # Offline news ingestion pipeline
│
├─ config/
│  ├─ redis.ts                # Upstash Redis configuration
│  └─ qdrant.ts               # Qdrant Cloud configuration
│  └─ genAI.ts                # Gemini AI instance
├─ routes/
│  └─ chat.routes.ts          # Express API routes
│
├─ utils/
│  └─ chunkText.ts            # Text chunking utility
│
└─ server.ts                  # Application entry point
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Server
SERVER_PORT=5000

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Qdrant Cloud
QDRANT_URL=https://your-cluster.region.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# Upstash Redis
REDIS_URL=rediss://default:password@host:6379
```

> ⚠️ **Do not commit `.env` files.**  
> All secrets are injected via environment variables in production.

---

## 🚀 Running Locally

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Qdrant Collection

Before running the ingestion pipeline, create a collection in Qdrant Cloud.

**Option A: Using the Script (Recommended)**
```bash
npx ts-node-dev src/config/qdrant.ts
```

**Option B: Manual Setup**
1. Log in to your [Qdrant Cloud Dashboard](https://cloud.qdrant.io)
2. Create a new collection named **`news_articles`**
3. Set vector size to **768** (Gemini text-embedding-004 dimension)
4. Choose distance metric: **Cosine**

### 3. Run the Ingestion Pipeline

Now populate Qdrant with news data:

```bash
npx ts-node-dev scripts/ingestNews.ts
```

**Pipeline steps:**
1. Fetch news articles (RSS / HTML)
2. Clean and chunk text
3. Generate embeddings using Gemini
4. Store vectors in Qdrant Cloud collection

### 3. Start Development Server

```bash
npm run dev
```

Server will run at:
```
http://localhost:5000
```

### 4. Health Check

```bash
GET /health
```

---

## 📡 API Endpoints

### 🔹 POST `/api/chat`

Send a message to the chatbot.

**Request:**
```json
{
  "message": "What is happening in global markets?",
  "sessionId": "optional-session-id"
}
```

**Response:**
```json
{
  "sessionId": "uuid",
  "answer": "Based on recent news articles..."
}
```

---

### 🔹 GET `/api/history/:sessionId`

Fetch chat history for a session.

**Response:**
```json
[
  { "role": "user", "content": "What is happening in global markets?" },
  { "role": "assistant", "content": "Based on recent news articles..." }
]
```

---

### 🔹 DELETE `/api/reset/:sessionId`

Reset a chat session.

**Response:**
```json
{
  "status": "reset",
  "sessionId": "uuid"
}
```

---

## 🧠 Design Decisions

### Why RAG?
- Prevents hallucinations
- Ensures answers are grounded in real data
- Makes responses explainable and auditable

### Why Redis for Sessions?
- Stateless API design
- Easy horizontal scaling
- Built-in session TTL support

### Why Intent-Based Routing?
- Improves UX for greetings and identity questions
- Keeps RAG pipeline strictly factual
- Faster responses for non-knowledge queries

---

## ☁️ Deployment (Render)

The backend is deployed on Render.

### Production Setup
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Port:** `process.env.PORT`
- **Secrets:** Injected via Render environment variables

### Health Check
```bash
GET /health
```

---

## 🔮 Future Improvements

- [ ] Token streaming with WebSockets
- [ ] Source attribution in responses
- [ ] Smarter intent classification
- [ ] Scheduled ingestion jobs
- [ ] Authentication & user profiles
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

## ✅ Current Status

**v1.0 — Feature Complete**

Includes:
- ✅ Full RAG pipeline
- ✅ Session-based chat API
- ✅ Redis-backed memory
- ✅ Cloud deployment readiness
- ✅ Production error handling

---

## 📌 Project Status

- ✔️ Backend complete
- ✔️ Deployed on Render
- ✔️ Ready for frontend integration

---

## 📄 License

MIT License - feel free to use this project for your own applications.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For questions or suggestions, please open an issue on GitHub.

---

**Built by Yash Yadao**
