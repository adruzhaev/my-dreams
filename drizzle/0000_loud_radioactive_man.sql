CREATE TABLE "dream_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"dream_id" serial NOT NULL,
	"image_url" text NOT NULL,
	"prompt" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "dreams" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"dream" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "interpretations" (
	"id" serial PRIMARY KEY NOT NULL,
	"dream_id" serial NOT NULL,
	"jungian" text NOT NULL,
	"freudian" text NOT NULL,
	"symbolic" text NOT NULL,
	"raw_response" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"telegram_user_id" bigint NOT NULL,
	"username" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_telegram_user_id_unique" UNIQUE("telegram_user_id")
);
--> statement-breakpoint
ALTER TABLE "dream_images" ADD CONSTRAINT "dream_images_dream_id_dreams_id_fk" FOREIGN KEY ("dream_id") REFERENCES "public"."dreams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interpretations" ADD CONSTRAINT "interpretations_dream_id_dreams_id_fk" FOREIGN KEY ("dream_id") REFERENCES "public"."dreams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "dreams_user_id_idx" ON "dreams" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "dreams_created_at_idx" ON "dreams" USING btree ("created_at");