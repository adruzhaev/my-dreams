import { Bot } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import { aiConfig } from "./config/ai";

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

bot.command("start", (ctx) => {
  ctx.reply(
    "🌙 Welcome to your Dream Interpreter! What did you see last night?",
  );
});

bot.on("message:text", async (ctx) => {
  const dream = ctx.message.text;
  const { model, maxTokens, systemPrompt } = aiConfig;

  await ctx.reply("🔮 Interpreting your dream...");

  try {
    const response = await anthropic.messages.create({
      model,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [{ role: "user", content: `I had this dream: ${dream}` }],
    });

    const interpretation =
      response.content[0].type === "text"
        ? response.content[0].text
        : "Could not interpret dream.";

    await ctx.reply(interpretation);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      const userMessage = `⚠️ AI error: ${error.error?.error?.message}`;
      await ctx.reply(userMessage);
    } else {
      await ctx.reply("😵 Something unexpected happened. Please try again.");
    }
    // console.error("Error:", error);
  }
});

bot.start();
console.log("Dream bot is running...");
