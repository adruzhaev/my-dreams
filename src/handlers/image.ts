import { MyContext } from "../types/context";
import { generateImage } from "../services/ai";
import { saveDreamImage } from "../services/image";
import { newDreamKeyboard } from "./keyboards";

export async function generateDreamImage(
  ctx: MyContext,
  dream: string,
  dreamId: number,
): Promise<void> {
  try {
    await ctx.reply("🎨 Generating your dream image...");

    const imageUrl = await generateImage(dream);

    await saveDreamImage(dreamId, imageUrl, dream);

    await ctx.replyWithPhoto(imageUrl, { reply_markup: newDreamKeyboard });
  } catch (error) {
    console.error("Image generation failed (non-fatal):", error);
  }
}
