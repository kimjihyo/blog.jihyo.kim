import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const commentsTable = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  nickname: text("nickname").notNull(),
  content: text("content").notNull(),
  avatar: text("avatar").notNull(),
  postSlug: text("post_slug").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
