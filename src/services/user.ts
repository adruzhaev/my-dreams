import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";

export async function findOrCreateUser(
  telegramUserId: number,
  username?: string,
) {
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.telegramUserId, telegramUserId))
    .limit(1);

  if (existing.length > 0) return existing[0];

  const created = await db
    .insert(users)
    .values({ telegramUserId, username })
    .returning();

  return created[0];
}
