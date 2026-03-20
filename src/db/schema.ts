import { pgTable, serial, text, timestamp, bigint } from "drizzle-orm/pg-core";

export const dreams = pgTable("dreams", {
  id: serial("id").primaryKey(),
  telegramUserId: bigint("telegram_user_id", { mode: "number" }).notNull(),
  dream: text("dream").notNull(),
  interpretation: text("interpretation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
