import "server-only";

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const commentsTable = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  nickname: text("nickname").notNull(),
  content: text("content").notNull(),
  avatar: text("avatar").notNull(),
  postSlug: text("post_slug").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const subscriptionsTable = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
