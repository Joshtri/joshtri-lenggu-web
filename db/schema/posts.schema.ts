import { sql } from 'drizzle-orm';
import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";
import { labels } from "./labels.schema";
import { types } from "./type.schema";
import { users } from "./users.schema";


export const posts = pgTable('posts', {
    id: uuid().default(sql`gen_random_uuid()`).primaryKey(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    title: varchar('title', { length: 255 }).notNull(),
    coverImage: varchar('cover_image', { length: 500 }).notNull(),
    content: text('content').notNull(),
    excerpt: text('excerpt').notNull(),
    authorId: uuid('author_id').references(() => users.id).notNull(),
    labelId: uuid('label_id').references(() => labels.id).notNull(),
    typeId: uuid('type_id').references(() => types.id).notNull(),
    ...timestamps
});