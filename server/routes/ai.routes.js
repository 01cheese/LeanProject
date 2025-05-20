import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { cleanData, formatPrompt } from "../utils/geminiUtils.js";

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API });

router.post("/gemini", async (req, res) => {
  try {
    // 📥 Входящие данные
    console.log("📥 Пришел запрос в /api/v1/ai/gemini");
    console.log("🧾 Оригинальные дані req.body:", JSON.stringify(req.body, null, 2));

    const cleaned = cleanData(req.body);
    console.log("🧼 Очищені дані:", JSON.stringify(cleaned, null, 2));

    const prompt = formatPrompt(cleaned);
    console.log("📤 Prompt (довжина:", prompt.length, "):");
    console.log(prompt.slice(0, 1000) + (prompt.length > 1000 ? "\n... (truncated)" : ""));

    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash", // Можна змінити назад на "gemini-2.0-flash"
      contents: [{ parts: [{ text: prompt }] }]
    });

    console.log("✅ Відповідь Gemini (весь об'єкт):", JSON.stringify(result, null, 2));

    const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "🤖 Помилка: Gemini не відповів.";

    console.log("📦 Оброблений текст Gemini:", text.slice(0, 500) + (text.length > 500 ? "\n... (truncated)" : ""));

    res.status(200).json({ result: text });

  } catch (err) {
    console.error("❌ Gemini AI Error:", err?.message || err);
    res.status(500).json({ error: "Failed to get AI recommendation." });
  }
});

export default router;
