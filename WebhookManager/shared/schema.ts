import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const webhooks = pgTable("webhooks", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  avatar: text("avatar"),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  webhookId: serial("webhook_id").references(() => webhooks.id),
  content: text("content"),
  username: text("username"),
  avatarUrl: text("avatar_url"),
  embeds: jsonb("embeds").$type<any[]>(),
  components: jsonb("components").$type<any[]>(),
  createdAt: text("created_at").notNull().default("NOW()"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWebhookSchema = createInsertSchema(webhooks).pick({
  name: true,
  url: true,
  avatar: true,
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  webhookId: true,
  content: true,
  username: true,
  avatarUrl: true,
  embeds: true,
  components: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWebhook = z.infer<typeof insertWebhookSchema>;
export type Webhook = typeof webhooks.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
