import { pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";

import { sql } from 'drizzle-orm/sql'
// 👆 Notice the `sql` import here!
import { timestamps } from "./columns.helpers";
import { posts } from "./posts.schema";
import { users } from "./users.schema";

export const comments = pgTable("comments", {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    content: text("content").notNull(),
    authorId: uuid("author_id").references(() => users.id),
    postId: uuid("post_id").references(() => posts.id),
    parentId: varchar("parent_id", { length: 40 }),
    ...timestamps,
});

export type Comments = typeof comments.$inferSelect;