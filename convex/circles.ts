import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireCircleMember } from "./helpers/auth";

export const listMyCircles = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const memberships = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const circles = await Promise.all(
      memberships.map(async (m) => {
        const circle = await ctx.db.get(m.circleId);
        if (!circle) return null;
        return { ...circle, role: m.role };
      })
    );

    return circles.filter(Boolean);
  },
});

export const create = mutation({
  args: {
    userId: v.id("users"),
    name: v.string(),
    colorTheme: v.optional(v.string()),
    defaultCheckinCadenceHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const cadence = args.defaultCheckinCadenceHours ?? 24;

    const circleId = await ctx.db.insert("circles", {
      name: args.name,
      ownerUserId: args.userId,
      colorTheme: args.colorTheme,
      defaultCheckinCadenceHours: cadence,
      archived: false,
      createdAt: now,
    });

    await ctx.db.insert("circle_members", {
      circleId,
      userId: args.userId,
      role: "owner",
      status: "active",
      reminderCadenceHours: cadence,
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

    return circleId;
  },
});

export const addMember = mutation({
  args: {
    callerUserId: v.id("users"),
    circleId: v.id("circles"),
    targetUserId: v.id("users"),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
  },
  handler: async (ctx, args) => {
    const callerMember = await requireCircleMember(ctx, args.circleId, args.callerUserId);

    if (!["owner", "admin"].includes(callerMember.role)) {
      throw new Error("Not authorized to add members");
    }

    const existing = await ctx.db
      .query("circle_members")
      .withIndex("by_circleId_userId", (q) =>
        q.eq("circleId", args.circleId).eq("userId", args.targetUserId)
      )
      .unique();

    if (existing && existing.status === "active") {
      throw new Error("User is already a member");
    }

    const circle = await ctx.db.get(args.circleId);
    const now = Date.now();

    const memberId = await ctx.db.insert("circle_members", {
      circleId: args.circleId,
      userId: args.targetUserId,
      role: args.role ?? "member",
      status: "active",
      reminderCadenceHours: circle?.defaultCheckinCadenceHours ?? 24,
      joinedAt: now,
    });

    await ctx.db.insert("member_state", {
      circleId: args.circleId,
      userId: args.targetUserId,
      status: "pending",
      needsCheckup: false,
      hasRecentSelfie: false,
      updatedAt: now,
    });

    return memberId;
  },
});
