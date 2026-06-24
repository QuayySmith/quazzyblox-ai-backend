import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const allowedModels = new Set([
  "gpt-5.5",
  "gpt-5.5-mini",
  "gpt-4.1"
]);

const modePrompts = {
  roblox:
    "You are in Roblox Developer Mode. Focus on Roblox Lua, Roblox Studio setup, RemoteEvents, ServerScriptService, StarterGui, ReplicatedStorage, DataStoreService, game systems, UI, and beginner-friendly instructions.",
  debug:
    "You are in Debug Mode. Find the likely issue, explain it clearly, then provide a corrected version. Ask for missing code only if absolutely needed.",
  ui:
    "You are in UI Designer Mode. Focus on Roblox ScreenGui layouts, mobile-friendly UI, styling, hierarchy, LocalScripts, and exact object placement.",
  monetize:
    "You are in Monetization Mode. Focus on Roblox gamepasses, developer products, pricing, economy balance, ethical monetization, retention, and roleplay value."
};

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

    const { messages = [], model = "gpt-5.5", mode = "roblox" } = req.body || {};
    const safeModel = allowedModels.has(model) ? model : "gpt-5.5";
    const safeModePrompt = modePrompts[mode] || modePrompts.roblox;

    const cleanMessages = Array.isArray(messages)
      ? messages
          .filter(m => m && typeof m.content === "string")
          .slice(-26)
          .map(m => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content.slice(0, 14000)
          }))
      : [];

    const response = await client.responses.create({
      model: safeModel,
      input: [
        {
          role: "system",
          content:
            "You are QuazzyBlox.AI, powered by GPT-5.5 Thinking. You are a professional Roblox development assistant. Help users write Roblox Lua, design Roblox UI, debug scripts, create game systems, plan roleplay maps, build economies, make gamepass ideas, improve monetization, and explain setup steps. When you give Roblox code, clearly say where every Script, LocalScript, ModuleScript, RemoteEvent, or GUI object goes. Keep answers practical, direct, and beginner-friendly. " +
            safeModePrompt
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
