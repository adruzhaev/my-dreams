import { NextFunction } from "grammy";
import { MyContext } from "../types/context";

export async function loggerMiddleware(ctx: MyContext, next: NextFunction) {
  const user = ctx.from?.username ?? "unknown";
  const text = ctx.message?.text ?? "";
  console.log(`[${new Date().toISOString()}] @${user}: ${text}`);
  await next();
}
