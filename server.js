import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

if (!process.env.GEMINI_API_KEY) {
  throw new Error("❌ GEMINI_API_KEY is not set");
}

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// TEMP STORAGE (MVP SAFE)
const chatHistory = {};

app.post("/chat", async (req, res) => {
  try {
    const { uid, message } = req.body;

    if (!uid || !message) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    const reply = response.text;

    if (!chatHistory[uid]) chatHistory[uid] = [];
    chatHistory[uid].push({ user: message, bot: reply });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gemini error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Gemini backend running on port ${PORT}`);
});
