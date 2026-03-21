import { db } from "../db";
import { dreamImages, dreams, interpretations } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { findOrCreateUser } from "./user";

export async function saveDream(
  telegramUserId: number,
  username: string | undefined,
  dreamText: string,
  jungian: string,
  freudian: string,
  symbolic: string,
  rawResponse: string,
) {
  const user = await findOrCreateUser(telegramUserId, username);

  const [dream] = await db
    .insert(dreams)
    .values({ userId: user.telegramUserId, dream: dreamText })
    .returning();

  await db
    .insert(interpretations)
    .values({ dreamId: dream.id, jungian, freudian, symbolic, rawResponse });

  return dream;
}

export async function getRecentDreams(telegramUserId: number, limit = 10) {
  return db
    .select({
      id: dreams.id,
      dream: dreams.dream,
      createdAt: dreams.createdAt,
      jungian: interpretations.jungian,
      freudian: interpretations.freudian,
      symbolic: interpretations.symbolic,
    })
    .from(dreams)
    .innerJoin(interpretations, eq(interpretations.dreamId, dreams.id))
    .where(eq(dreams.userId, telegramUserId))
    .orderBy(desc(dreams.createdAt))
    .limit(limit);
}
