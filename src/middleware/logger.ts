import { Context, NextFunction } from "grammy";

export async function loggerMiddleware(ctx: Context, next: NextFunction) {
  const user = ctx.from?.username ?? "unknown";
  const text = ctx.message?.text ?? "";
  console.log(`[${new Date().toISOString()}] @${user}: ${text}`);
  await next();
}
