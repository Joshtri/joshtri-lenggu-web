CREATE TABLE "types" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "type" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "type" CASCADE;--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_type_id_type_id_fk";
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_type_id_types_id_fk" FOREIGN KEY ("type_id") REFERENCES "public"."types"("id") ON DELETE no action ON UPDATE no action;