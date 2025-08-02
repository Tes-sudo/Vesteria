import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    emailVerified: v.optional(v.number()),
  }),
  
  sessions: defineTable({
    userId: v.id("users"),
    expiresAt: v.number(),
  }).index("by_user_id", ["userId"]),
  
  // Add your app-specific tables here
});