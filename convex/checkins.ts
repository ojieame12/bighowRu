import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireUser, requireCircleMember } from "./helpers/auth";
import {
  computeCheckinScore,
  checkinScoreToPositivity,
  positivityToDiscreteMood,
} from "./scoring";

export const submit = mutation({
  args: {
    circleId: v.id("circles"),
    phaseSelections: v.array(
      v.object({
        phaseTitle: v.string(),
        emojiId: v.string(),
        emojiLabel: v.string(),
        emojiIndex: v.number(),
      })
    ),
    painScore: v.optional(v.number()),
    note: v.optional(v.string()),
    source: v.optional(
      v.union(v.literal("dial"), v.literal("manual"), v.literal("import"))
    ),
    idempotencyKey: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);

    // 1. Idempotency — scoped by userId to prevent cross-user collision
    const scopedKey = `${user._id}:${args.circleId}:${args.idempotencyKey}`;
    const existing = await ctx.db
      .query("checkins")
      .withIndex("by_idempotencyKey", (q) => q.eq("idempotencyKey", scopedKey))
      .unique();
    if (existing) return existing._id;

    // 2. Membership check
    const member = await requireCircleMember(ctx, args.circleId, user._id);

    // 3. Server-side scoring
    const { score } = computeCheckinScore(
      args.phaseSelections.map((s) => ({ emojiIndex: s.emojiIndex }))
    );
    const positivity = checkinScoreToPositivity(score);
    const discreteMood = positivityToDiscreteMood(positivity);

    const now = Date.now();

    // 4. Write check-in
    const checkinId = await ctx.db.insert("checkins", {
      circleId: args.circleId,
      userId: user._id,
      positivity,
      discreteMood,
      phaseSelections: args.phaseSelections,
      painScore: args.painScore,
      note: args.note,
      createdAt: now,
      source: args.source ?? "dial",
      idempotencyKey: scopedKey,
    });

    // 5. Update member_state
    const cadenceMs = member.reminderCadenceHours * 3600 * 1000;
    const nextDueAt = now + cadenceMs;

    const memberState = await ctx.db
      .query("member_state")
      .withIndex("by_circleId_userId", (q) =>
        q.eq("circleId", args.circleId).eq("userId", user._id)
      )
      .unique();

    const stateUpdate = {
      latestCheckinId: checkinId,
      latestPositivity: positivity,
      latestDiscreteMood: discreteMood,
      latestPainScore: args.painScore,
      latestPhaseSelections: args.phaseSelections,
      lastCheckinAt: now,
      nextDueAt,
      status: "checked_in" as const,
      needsCheckup: false,
      updatedAt: now,
    };

    if (memberState) {
      await ctx.db.patch(memberState._id, stateUpdate);
    } else {
      await ctx.db.insert("member_state", {
        circleId: args.circleId,
        userId: user._id,
        ...stateUpdate,
        hasRecentSelfie: false,
      });
    }

    // 6. Upsert trend daily bucket — use member timezone if available
    const profile = await ctx.db
      .query("user_profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .unique();

    const tz = profile?.timezone ?? "UTC";
    let dayKey: string;
    try {
      dayKey = new Date(now).toLocaleDateString("en-CA", { timeZone: tz });
    } catch {
      dayKey = new Date(now).toISOString().split("T")[0];
    }

    const trendDaily = await ctx.db
      .query("member_trend_daily")
      .withIndex("by_circleId_userId_dayKey", (q) =>
        q
          .eq("circleId", args.circleId)
          .eq("userId", user._id)
          .eq("dayKey", dayKey)
      )
      .unique();

    if (trendDaily) {
      const newCount = trendDaily.sampleCount + 1;
      const newMoodAvg =
        (trendDaily.moodAvg * trendDaily.sampleCount + positivity) / newCount;
      // Running average for painAvg
      const newPainAvg =
        args.painScore != null
          ? trendDaily.painAvg != null
            ? (trendDaily.painAvg * trendDaily.sampleCount + args.painScore) /
              newCount
            : args.painScore
          : trendDaily.painAvg;
      await ctx.db.patch(trendDaily._id, {
        moodAvg: newMoodAvg,
        moodMin: Math.min(trendDaily.moodMin, positivity),
        moodMax: Math.max(trendDaily.moodMax, positivity),
        painAvg: newPainAvg,
        sampleCount: newCount,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("member_trend_daily", {
        circleId: args.circleId,
        userId: user._id,
        dayKey,
        moodAvg: positivity,
        moodMin: positivity,
        moodMax: positivity,
        painAvg: args.painScore,
        sampleCount: 1,
        updatedAt: now,
      });
    }

    return checkinId;
  },
});

export const listRecent = query({
  args: {
    circleId: v.id("circles"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Auth guard — caller must be a circle member
    const user = await requireUser(ctx);
    await requireCircleMember(ctx, args.circleId, user._id);

    return await ctx.db
      .query("checkins")
      .withIndex("by_circleId_createdAt", (q) =>
        q.eq("circleId", args.circleId)
      )
      .order("desc")
      .take(args.limit ?? 20);
  },
});
