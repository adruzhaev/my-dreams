ALTER TABLE "interpretations" ADD COLUMN "symbols" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "interpretations" ADD COLUMN "emotions" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "interpretations" ADD COLUMN "themes" text[] DEFAULT '{}' NOT NULL;