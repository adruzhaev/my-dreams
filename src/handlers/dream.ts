import { Context } from "grammy";
import Anthropic from "@anthropic-ai/sdk";
import { interpretDream } from "../services/ai";
import { saveDream } from "../services/dream";
import { parseInterpretation } from "../utils/parse";

const processingUsers = new Set<number>();

export async function dreamHandler(ctx: Context) {
  const dream = ctx.message?.text;
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  if (!dream || !userId) return;

  if (processingUsers.has(userId)) return;

  processingUsers.add(userId);
  await ctx.reply("🔮 Interpreting your dream...");

  try {
    const rawResponse = await interpretDream(dream);
    const { jungian, freudian, symbolic } = parseInterpretation(rawResponse);

    await saveDream(
      userId,
      username,
      dream,
      jungian,
      freudian,
      symbolic,
      rawResponse,
    );
    await ctx.reply(rawResponse, { parse_mode: "Markdown" });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      const userMessage = `⚠️ AI error: ${error.error?.error?.message}`;
      await ctx.reply(userMessage);
    } else {
      await ctx.reply("😵 Something unexpected happened. Please try again.");
    }
  } finally {
    processingUsers.delete(userId);
  }
}
