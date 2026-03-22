import { Context, SessionFlavor } from "grammy";
import { I18nFlavor } from "@grammyjs/i18n";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type SessionData = {
  messages: Message[];
  dreamId: number | null;
};

export type MyContext = Context & SessionFlavor<SessionData> & I18nFlavor;
