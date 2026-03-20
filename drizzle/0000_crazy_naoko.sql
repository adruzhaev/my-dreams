CREATE TABLE "dreams" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_user_id" bigint NOT NULL,
	"dream" text NOT NULL,
	"interpretation" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
