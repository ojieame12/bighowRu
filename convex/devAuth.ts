// Auth placeholder — @convex-dev/auth integration will be wired
// once the ESM bundler resolution is fixed.
// For now, auth functions are stubbed.

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Temporary: create a test user for development
export const createTestUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      tokenIdentifier: `dev:${args.email}`,
    });
  },
});

export const getTestUser = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .unique();
  },
});
