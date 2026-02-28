import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get user's app state by userId.
 * Returns circles and active circle for the user.
 */
export const getMyState = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const memberships = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId!))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    if (memberships.length === 0) {
      return { needsBootstrap: true, userId: args.userId, activeCircleId: null, circles: [] };
    }

    const circles = await Promise.all(
      memberships.map(async (m) => {
        const circle = await ctx.db.get(m.circleId);
        if (!circle) return null;
        return { id: circle._id, name: circle.name, role: m.role };
      })
    );

    const validCircles = circles.filter(Boolean);

    return {
      needsBootstrap: false,
      userId: args.userId,
      activeCircleId: validCircles[0]?.id ?? null,
      circles: validCircles,
    };
  },
});

/**
 * Bootstrap a new user: create profile + default circle.
 */
export const initUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();

    // Check if already bootstrapped
    const existing = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .first();
    if (existing) return { circleId: existing.circleId };

    // Create user profile
    await ctx.db.insert("user_profiles", {
      userId: args.userId,
      displayName: user.name ?? "New User",
      updatedAt: now,
    });

    // Create default circle
    const displayName = user.name ?? "My";
    const circleId = await ctx.db.insert("circles", {
      name: `${displayName}'s Circle`,
      ownerUserId: args.userId,
      defaultCheckinCadenceHours: 24,
      archived: false,
      createdAt: now,
    });

    await ctx.db.insert("circle_members", {
      circleId,
      userId: args.userId,
      role: "owner",
      status: "active",
      reminderCadenceHours: 24,
      joinedAt: now,
    });

    await ctx.db.insert("member_state", {
      circleId,
      userId: args.userId,
      status: "pending",
      needsCheckup: false,
      hasRecentSelfie: false,
      updatedAt: now,
    });

    return { circleId };
  },
});
