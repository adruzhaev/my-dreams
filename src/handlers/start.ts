import { Context } from "grammy";

export async function startHandler(ctx: Context) {
  await ctx.reply(
    "🌙 *Welcome to your Dream Interpreter*\n\n" +
      "Tell me any dream and I'll interpret it through three lenses:\n" +
      "🧠 Jungian · 💭 Freudian · 🔮 Symbolic\n\n" +
      "Just type your dream whenever you're ready.",
    { parse_mode: "Markdown" },
  );
}
