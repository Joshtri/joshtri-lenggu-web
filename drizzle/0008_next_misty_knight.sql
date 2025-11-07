-- ALTER TABLE "posts" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "posts" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
-- ALTER TABLE "labels" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "labels" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
-- ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "users" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
-- ALTER TABLE "comments" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "comments" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
-- ALTER TABLE "type" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
-- ALTER TABLE "type" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();


ALTER TABLE "comments" DROP COLUMN "id";
ALTER TABLE "comments" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY;


ALTER TABLE "users" DROP COLUMN "id";
ALTER TABLE "users" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY;


ALTER TABLE "labels" DROP COLUMN "id";
ALTER TABLE "labels" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY;


ALTER TABLE "posts" DROP COLUMN "id";
ALTER TABLE "posts" ADD COLUMN "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY;