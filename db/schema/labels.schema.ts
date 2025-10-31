import { integer, pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./columns.helpers";

export const labels = pgTable('labels', {
    id: serial('id').primaryKey().notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(), // Hex color code
    description: text('description'),
    ...timestamps
});