import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireCircleMember } from "./helpers/auth";

export const listMyCircles = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);

    const memberships = await ctx.db
      .query("circle_members")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
    name: v.string(),
    colorTheme: v.optional(v.string()),
    defaultCheckinCadenceHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const now = Date.now();
    const cadence = args.defaultCheckinCadenceHours ?? 24;

    const circleId = await ctx.db.insert("circles", {
      name: args.name,
      ownerUserId: user._id,
      colorTheme: args.colorTheme,
      defaultCheckinCadenceHours: cadence,
      archived: false,
      createdAt: now,
    });

    await ctx.db.insert("circle_members", {
      circleId,
      userId: user._id,
      role: "owner",
      status: "active",
      reminderCadenceHours: cadence,
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

    return circleId;
  },
});

export const addMember = mutation({
  args: {
    circleId: v.id("circles"),
    targetUserId: v.id("users"),
    role: v.optional(v.union(v.literal("admin"), v.literal("member"))),
  },
  handler: async (ctx, args) => {
    const caller = await requireUser(ctx);
    const callerMember = await requireCircleMember(ctx, args.circleId, caller._id);

    if (!["owner", "admin"].includes(callerMember.role)) {
      throw new Error("Not authorized to add members");
    }

    // Check for existing membership (active or otherwise)
    const existing = await ctx.db
      .query("circle_members")
      .withIndex("by_circleId_userId", (q) =>
        q.eq("circleId", args.circleId).eq("userId", args.targetUserId)
      )
      .unique();

    const circle = await ctx.db.get(args.circleId);
    const now = Date.now();

    if (existing) {
      if (existing.status === "active") {
        throw new Error("User is already a member");
      }
      // Re-activate removed/pending member instead of creating duplicate
      await ctx.db.patch(existing._id, {
        role: args.role ?? "member",
        status: "active",
        reminderCadenceHours: circle?.defaultCheckinCadenceHours ?? 24,
        joinedAt: now,
      });

      // Reset their member_state
      const memberState = await ctx.db
        .query("member_state")
        .withIndex("by_circleId_userId", (q) =>
          q.eq("circleId", args.circleId).eq("userId", args.targetUserId)
        )
        .unique();

      if (memberState) {
        await ctx.db.patch(memberState._id, {
          status: "pending",
          needsCheckup: false,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("member_state", {
          circleId: args.circleId,
          userId: args.targetUserId,
          status: "pending",
          needsCheckup: false,
          hasRecentSelfie: false,
          updatedAt: now,
        });
      }

      return existing._id;
    }

    // New member
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
