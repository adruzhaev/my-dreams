import { db } from "../db";
import { dreams } from "../db/schema";
import { desc, eq } from "drizzle-orm";

export async function saveDream(
  telegramUserId: number,
  dream: string,
  interpretation: string,
) {
  await db.insert(dreams).values({
    telegramUserId,
    dream,
    interpretation,
  });
}

export async function getRecentDreams(telegramUserId: number, limit = 10) {
  return db
    .select()
    .from(dreams)
    .where(eq(dreams.telegramUserId, telegramUserId))
    .orderBy(desc(dreams.createdAt))
    .limit(limit);
}
