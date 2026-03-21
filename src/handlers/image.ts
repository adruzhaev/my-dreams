import { Context } from "grammy";
import { generateImage } from "../services/ai";
import { saveDreamImage } from "../services/image";

export async function generateDreamImage(
  ctx: Context,
  dream: string,
  dreamId: number,
): Promise<void> {
  try {
    await ctx.reply("🎨 Generating your dream image...");

    const imageUrl = await generateImage(dream);

    await saveDreamImage(dreamId, imageUrl, dream);

    await ctx.replyWithPhoto(imageUrl);
  } catch (error) {
    console.error("Image generation failed (non-fatal):", error);
  }
}
