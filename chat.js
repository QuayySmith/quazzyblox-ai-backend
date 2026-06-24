import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedModels = new Set(["gpt-5.5", "gpt-5.5-mini", "gpt-4.1"]);

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Use POST. QuazzyBlox.AI backend is online."
    });
  }

  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "Missing OPENAI_API_KEY in Vercel Environment Variables."
      });
    }

    const { messages = [], model = "gpt-5.5" } = req.body || {};
    const safeModel = allowedModels.has(model) ? model : "gpt-5.5";

    const cleanMessages = Array.isArray(messages)
      ? messages
          .filter(m => m && typeof m.content === "string")
          .slice(-24)
          .map(m => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content.slice(0, 12000)
          }))
      : [];

    const response = await client.responses.create({
      model: safeModel,
      input: [
        {
          role: "system",
          content:
            "You are QuazzyBlox.AI, powered by GPT-5.5 Thinking. You are a professional Roblox development assistant. You help users write Roblox Lua, design Roblox UI, debug scripts, create game systems, plan roleplay maps, make gamepass ideas, improve monetization, and explain setup steps clearly. When giving code, say where each script goes in Roblox Studio. Keep responses helpful, practical, and beginner-friendly."
        },
        ...cleanMessages
      ],
    });

    return res.status(200).json({
      reply: response.output_text || "I generated a response, but no text was returned."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "QuazzyBlox.AI backend error",
      details: error.message
    });
  }
}
