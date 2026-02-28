import { query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireCircleMember } from "./helpers/auth";

export const listForCircle = query({
  args: { circleId: v.id("circles") },
  handler: async (ctx, args) => {
    const caller = await requireUser(ctx);

    // Verify caller membership
    await requireCircleMember(ctx, args.circleId, caller._id);

    // Get all active members
    const members = await ctx.db
      .query("circle_members")
      .withIndex("by_circleId", (q) => q.eq("circleId", args.circleId))
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    const now = Date.now();

    const contacts = await Promise.all(
      members.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        if (!user) return null;

        const state = await ctx.db
          .query("member_state")
          .withIndex("by_circleId_userId", (q) =>
            q.eq("circleId", args.circleId).eq("userId", m.userId)
          )
          .unique();

        // 14d trend snapshot (empty until Phase 4)
        const trend = await ctx.db
          .query("member_trend_snapshot")
          .withIndex("by_circleId_userId_windowDays", (q) =>
            q.eq("circleId", args.circleId).eq("userId", m.userId).eq("windowDays", 14)
          )
          .unique();

        const secondsUntilDue = state?.nextDueAt
          ? Math.max(0, Math.floor((state.nextDueAt - now) / 1000))
          : undefined;

        // User profile for display name
        const profile = await ctx.db
          .query("user_profiles")
          .withIndex("by_userId", (q) => q.eq("userId", m.userId))
          .unique();

        return {
          memberId: m.userId,
          name: profile?.displayName ?? (user as any).name ?? "Unknown",
          email: (user as any).email,
          avatarUrl: profile?.avatarUrl ?? (user as any).image,
          role: m.role,
          status: state?.status ?? "pending",
          latestPositivity: state?.latestPositivity,
          latestDiscreteMood: state?.latestDiscreteMood,
          latestPhaseSelections: state?.latestPhaseSelections,
          lastCheckinAt: state?.lastCheckinAt,
          secondsUntilDue,
          needsCheckup: state?.needsCheckup ?? false,
          hasRecentSelfie: state?.hasRecentSelfie ?? false,
          trendMood14d: trend?.moodPoints?.map((p) => p.value ?? null) ?? [],
          trendDirectionMood: trend?.moodDirection ?? "stable",
        };
      })
    );

    return contacts.filter(Boolean);
  },
});
