import { db } from "../db";
import { dreamImages } from "../db/schema";

export async function saveDreamImage(
  dreamId: number,
  imageUrl: string,
  imagePrompt: string,
): Promise<void> {
  await db.insert(dreamImages).values({
    dreamId,
    imageUrl,
    prompt: imagePrompt,
  });
}
