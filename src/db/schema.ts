import {
  pgTable,
  serial,
  text,
  timestamp,
  bigint,
  index,
  jsonb,
  customType,
} from "drizzle-orm/pg-core";

const vector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions: number };
}>({
  dataType(config) {
    return `vector(${config?.dimensions ?? 1536})`;
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value.slice(1, -1).split(",").map(Number);
  },
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  telegramUserId: bigint("telegram_user_id", { mode: "number" })
    .notNull()
    .unique(),
  username: text("username"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dreams = pgTable(
  "dreams",
  {
    id: serial("id").primaryKey(),
    userId: bigint("user_id", { mode: "number" }).notNull(),
    dream: text("dream").notNull(),
    embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("dreams_user_id_idx").on(table.userId),
    index("dreams_created_at_idx").on(table.createdAt),
  ],
);

export const interpretations = pgTable("interpretations", {
  id: serial("id").primaryKey(),
  dreamId: serial("dream_id")
    .references(() => dreams.id)
    .notNull(),
  jungian: text("jungian").notNull(),
  freudian: text("freudian").notNull(),
  symbolic: text("symbolic").notNull(),
  symbols: text("symbols").array().notNull().default([]),
  emotions: text("emotions").array().notNull().default([]),
  themes: text("themes").array().notNull().default([]),
  rawResponse: text("raw_response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  key: text("key").primaryKey(),
  value: jsonb("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const dreamImages = pgTable("dream_images", {
  id: serial("id").primaryKey(),
  dreamId: serial("dream_id")
    .references(() => dreams.id)
    .notNull(),
  imageUrl: text("image_url").notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
