import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  try {
    const { messages = [], model = "gpt-5.5" } = req.body;

    const response = await client.responses.create({
      model,
      input: [
        {
          role: "system",
          content: "You are QuazzyBlox.AI, powered by GPT-5.5 Thinking. You specialize in Roblox Lua, Roblox UI, game systems, debugging, GitHub Pages, Firebase setup, and beginner-friendly instructions. Give copy-paste-ready code when useful."
        },
        ...messages
      ]
    });

    res.status(200).json({ reply: response.output_text });
  } catch (error) {
    res.status(500).json({
      error: "AI backend error",
      details: error.message
    });
  }
}
