import { Bot } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

bot.command("start", (ctx) => {
  ctx.reply(
    "🌙 Welcome to your Dream Interpreter! What did you see last night?",
  );
});

bot.on("message:text", async (ctx) => {
  const dream = ctx.message.text;

  await ctx.reply("🔮 Interpreting your dream...");

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: `You are a dream interpreter. When given a dream, you interpret it using three approaches:
1. **Jungian** – archetypes, shadow self, collective unconscious
2. **Freudian** – unconscious desires, symbolism, repression
3. **Symbolic** – universal dream symbols and their meanings

Keep each interpretation concise, 2-3 sentences. Be insightful but accessible.`,
    messages: [{ role: "user", content: `I had this dream: ${dream}` }],
  });

  const interpretation =
    response.content[0].type === "text"
      ? response.content[0].text
      : "Could not interpret dream.";

  await ctx.reply(interpretation);
});

bot.start();
console.log("Dream bot is running...");
