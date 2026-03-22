import Anthropic from "@anthropic-ai/sdk";
import { interpretDream, followUpDream } from "../services/ai";
import { saveDream } from "../services/dream";
import { parseInterpretation, formatInterpretation } from "../utils/parse";
import { generateDreamImage } from "./image";
import { MyContext } from "../types/context";
import { newDreamKeyboard } from "./keyboards";

const processingUsers = new Set<number>();

export async function dreamHandler(ctx: MyContext) {
  const text = ctx.message?.text;
  const userId = ctx.from?.id;
  const username = ctx.from?.username;

  if (!text || !userId) return;

  if (processingUsers.has(userId)) return;

  processingUsers.add(userId);

  try {
    if (ctx.session.messages.length > 0) {
      await handleFollowUp(ctx, text);
    } else {
      await handleNewDream(ctx, text, userId, username);
    }
  } finally {
    processingUsers.delete(userId);
  }
}

async function handleNewDream(
  ctx: MyContext,
  dream: string,
  userId: number,
  username: string | undefined,
) {
  await ctx.reply(ctx.t("interpreting"));

  try {
    const rawResponse = await interpretDream(dream);
    const interpretation = parseInterpretation(rawResponse);
    const formatted = formatInterpretation(interpretation);

    const dreamRecord = await saveDream(
      userId,
      username,
      dream,
      interpretation,
      rawResponse,
    );

    ctx.session.messages = [
      { role: "user", content: `I had this dream: ${dream}` },
      { role: "assistant", content: formatted },
    ];
    ctx.session.dreamId = dreamRecord.id;

    await ctx.reply(formatted, { parse_mode: "Markdown" });

    await generateDreamImage(ctx, dream, dreamRecord.id);
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      await ctx.reply(
        ctx.t("error-ai", { message: error.error?.error?.message }),
      );
    } else {
      console.error("Unexpected error in handleNewDream:", error);
      await ctx.reply(ctx.t("error-unexpected"));
    }
  }
}

async function handleFollowUp(ctx: MyContext, question: string) {
  await ctx.reply(ctx.t("thinking"));

  try {
    const messages = [
      ...ctx.session.messages,
      { role: "user" as const, content: question },
    ];
    const answer = await followUpDream(messages);

    ctx.session.messages = [
      ...messages,
      { role: "assistant" as const, content: answer },
    ];

    await ctx.reply(answer, {
      parse_mode: "Markdown",
      reply_markup: newDreamKeyboard(ctx),
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      await ctx.reply(
        ctx.t("error-ai", { message: error.error?.error?.message }),
      );
    } else {
      console.error("Unexpected error in handleFollowUp:", error);
      await ctx.reply(ctx.t("error-unexpected"));
    }
  }
}
