 import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/api/query", async (req, res) => {
  try {
    const { query, language, archetype } = req.body;

    if (!query) {
      return res.status(400).json({
        error: "Query is required",
      });
    }

    const systemPrompt = `
You are ScienceSpark AI.

Language: ${language}
Mode: ${archetype}

Rules:

- Answer using Markdown.
- Use headings.
- Use bullet points whenever useful.
- Never generate Mermaid diagrams.
- Never generate HTML.
- Never generate SVG.
- Wrap programming code in fenced Markdown code blocks.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: query,
        },
      ],
    });

    const answer =
      completion.choices?.[0]?.message?.content ??
      "No response generated.";

    res.json({
      response: answer,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      error: "Internal Server Error",
      response: error.message,
    });
  }
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});