-- Safe migration to convert serial IDs to UUIDs while preserving data
-- WARNING: This will still change all IDs, so existing references will break
-- Only use if you understand the implications

BEGIN;

-- Step 1: Drop all foreign key constraints first
ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_author_id_users_id_fk";
ALTER TABLE "comments" DROP CONSTRAINT IF EXISTS "comments_post_id_posts_id_fk";
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_author_id_users_id_fk";
ALTER TABLE "posts" DROP CONSTRAINT IF EXISTS "posts_label_id_labels_id_fk";

-- Step 2: Add new UUID columns
ALTER TABLE "users" ADD COLUMN "new_id" uuid DEFAULT gen_random_uuid();
ALTER TABLE "labels" ADD COLUMN "new_id" uuid DEFAULT gen_random_uuid();
ALTER TABLE "posts" ADD COLUMN "new_id" uuid DEFAULT gen_random_uuid();
ALTER TABLE "comments" ADD COLUMN "new_id" uuid DEFAULT gen_random_uuid();

-- Step 3: Create mapping tables to preserve relationships
CREATE TEMP TABLE user_id_map AS
SELECT id AS old_id, new_id FROM "users";

CREATE TEMP TABLE label_id_map AS
SELECT id AS old_id, new_id FROM "labels";

CREATE TEMP TABLE post_id_map AS
SELECT id AS old_id, new_id FROM "posts";

-- Step 4: Update foreign key references
-- Update posts.author_id
ALTER TABLE "posts" ADD COLUMN "new_author_id" uuid;
UPDATE "posts" SET "new_author_id" = user_id_map.new_id
FROM user_id_map
WHERE "posts"."author_id"::integer = user_id_map.old_id;

-- Update posts.label_id
ALTER TABLE "posts" ADD COLUMN "new_label_id" uuid;
UPDATE "posts" SET "new_label_id" = label_id_map.new_id
FROM label_id_map
WHERE "posts"."label_id"::integer = label_id_map.old_id;

-- Update comments.author_id
ALTER TABLE "comments" ADD COLUMN "new_author_id" uuid;
UPDATE "comments" SET "new_author_id" = user_id_map.new_id
FROM user_id_map
WHERE "comments"."author_id"::integer = user_id_map.old_id;

-- Update comments.post_id
ALTER TABLE "comments" ADD COLUMN "new_post_id" uuid;
UPDATE "comments" SET "new_post_id" = post_id_map.new_id
FROM post_id_map
WHERE "comments"."post_id"::integer = post_id_map.old_id;

-- Step 5: Drop old columns
ALTER TABLE "users" DROP COLUMN "id";
ALTER TABLE "labels" DROP COLUMN "id";
ALTER TABLE "posts" DROP COLUMN "id", DROP COLUMN "author_id", DROP COLUMN "label_id";
ALTER TABLE "comments" DROP COLUMN "id", DROP COLUMN "author_id", DROP COLUMN "post_id";

-- Step 6: Rename new columns to original names
ALTER TABLE "users" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "labels" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "posts" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "posts" RENAME COLUMN "new_author_id" TO "author_id";
ALTER TABLE "posts" RENAME COLUMN "new_label_id" TO "label_id";
ALTER TABLE "comments" RENAME COLUMN "new_id" TO "id";
ALTER TABLE "comments" RENAME COLUMN "new_author_id" TO "author_id";
ALTER TABLE "comments" RENAME COLUMN "new_post_id" TO "post_id";

-- Step 7: Add primary key constraints
ALTER TABLE "users" ADD PRIMARY KEY ("id");
ALTER TABLE "labels" ADD PRIMARY KEY ("id");
ALTER TABLE "posts" ADD PRIMARY KEY ("id");
ALTER TABLE "comments" ADD PRIMARY KEY ("id");

-- Step 8: Re-add foreign key constraints
ALTER TABLE "comments" ADD CONSTRAINT "comments_author_id_users_id_fk"
    FOREIGN KEY ("author_id") REFERENCES "users"("id");
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_id_fk"
    FOREIGN KEY ("post_id") REFERENCES "posts"("id");
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk"
    FOREIGN KEY ("author_id") REFERENCES "users"("id");
ALTER TABLE "posts" ADD CONSTRAINT "posts_label_id_labels_id_fk"
    FOREIGN KEY ("label_id") REFERENCES "labels"("id");

COMMIT;
