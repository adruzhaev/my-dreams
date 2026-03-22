import { StorageAdapter } from "grammy";
import { sql } from "./index";

export class PostgresSessionStorage<T> implements StorageAdapter<T> {
  async read(key: string): Promise<T | undefined> {
    const result = await sql`
      SELECT value FROM sessions WHERE key = ${key}
    `;
    return result[0]?.value;
  }

  async write(key: string, value: T): Promise<void> {
    await sql`
      INSERT INTO sessions (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = ${JSON.stringify(value)}, updated_at = NOW()
    `;
  }

  async delete(key: string): Promise<void> {
    await sql`DELETE FROM sessions WHERE key = ${key}`;
  }
}
