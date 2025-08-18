import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, real, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brewingData = pgTable("brewing_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  kettleTemperature: real("kettle_temperature").notNull(),
  maltTemperature: real("malt_temperature").notNull(),
  mode: text("mode").notNull(),
  power: integer("power").notNull(),
  timeGMT: text("time_gmt").notNull(),
  fermenterBeerType: text("fermenter_beer_type").notNull(),
  fermenterTemperature: real("fermenter_temperature").notNull(),
  fermenterGravity: real("fermenter_gravity").notNull(),
  fermenterTotal: text("fermenter_total").notNull(),
  fermenterTimeRemaining: text("fermenter_time_remaining").notNull(),
  fermenterProgress: integer("fermenter_progress").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const stats = pgTable("stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalBatches: integer("total_batches").notNull(),
  litersProduced: integer("liters_produced").notNull(),
  activeFermenters: integer("active_fermenters").notNull(),
  daysSinceLastBatch: integer("days_since_last_batch").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertBrewingDataSchema = createInsertSchema(brewingData).omit({
  id: true,
  updatedAt: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStatsSchema = createInsertSchema(stats).omit({
  id: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBrewingData = z.infer<typeof insertBrewingDataSchema>;
export type BrewingData = typeof brewingData.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertStats = z.infer<typeof insertStatsSchema>;
export type Stats = typeof stats.$inferSelect;
