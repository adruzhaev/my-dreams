import type { LanguageCode } from "@grammyjs/types";

type BotCommand = { command: string; description: string };

export const botCommands: { lang: LanguageCode; commands: BotCommand[] }[] = [
  {
    lang: "en",
    commands: [
      { command: "start", description: "Welcome message" },
      { command: "search", description: "Search your dreams semantically" },
      { command: "report", description: "Batch analysis report (optional: days)" },
    ],
  },
  {
    lang: "ru",
    commands: [
      { command: "start", description: "Приветственное сообщение" },
      { command: "search", description: "Семантический поиск по снам" },
      { command: "report", description: "Анализ снов за период (опционально: дни)" },
    ],
  },
];
