// routes/ai.routes.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { cleanData, formatPrompt } from '../utils/geminiUtils.js'
dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

// 🧠 Обработка запроса к Gemini
router.post("/gemini", async (req, res) => {
  try {
    const cleaned = cleanData(req.body);
    const prompt = formatPrompt(cleaned);

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ parts: [{ text: prompt }] }]
    });

    const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 Помилка: Gemini не відповів.";

    res.status(200).json({ result: text });
  } catch (err) {
    console.error("❌ Gemini AI Error:", err?.message || err);
    res.status(500).json({ error: "Failed to get AI recommendation." });
  }
});

export default router;
