import { query, mutation } from "./_generated/server";
import { getAuthUserId, requireUser } from "./helpers/auth";

/**
 * Get the current user's app state.
 * Returns null if not authenticated.
 * Returns { needsBootstrap: true } if no circles exist.
 * Returns { activeCircleId, circles } if ready.
 */
export const getMyState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const memberships = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    if (memberships.length === 0) {
      return { needsBootstrap: true, userId, activeCircleId: null, circles: [] };
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
      userId,
      activeCircleId: validCircles[0]?.id ?? null,
      circles: validCircles,
    };
  },
});

/**
 * Bootstrap a new user: create profile + default circle.
 * Derives userId from auth context — no client-supplied userId.
 */
export const initUser = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const now = Date.now();

    // Check if already bootstrapped
    const existing = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .first();
    if (existing) return { circleId: existing.circleId };

    // Create user profile
    await ctx.db.insert("user_profiles", {
      userId: user._id,
      displayName: (user as any).name ?? "New User",
      updatedAt: now,
    });

    // Create default circle
    const displayName = (user as any).name ?? "My";
    const circleId = await ctx.db.insert("circles", {
      name: `${displayName}'s Circle`,
      ownerUserId: user._id,
      defaultCheckinCadenceHours: 24,
      archived: false,
      createdAt: now,
    });

    await ctx.db.insert("circle_members", {
      circleId,
      userId: user._id,
      role: "owner",
      status: "active",
      reminderCadenceHours: 24,
      joinedAt: now,
    });

    await ctx.db.insert("member_state", {
      circleId,
      userId: user._id,
      status: "pending",
      needsCheckup: false,
      hasRecentSelfie: false,
      updatedAt: now,
    });

    return { circleId };
  },
});
