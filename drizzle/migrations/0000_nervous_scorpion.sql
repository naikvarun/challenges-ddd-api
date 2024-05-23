CREATE TABLE IF NOT EXISTS "challenges" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"content" text NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "challenges_name_unique" UNIQUE("name")
);
