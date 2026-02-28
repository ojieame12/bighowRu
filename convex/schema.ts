import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const phaseSelectionValidator = v.object({
  phaseTitle: v.string(),
  emojiId: v.string(),
  emojiLabel: v.string(),
  emojiIndex: v.number(),
});

const discreteMoodValidator = v.union(
  v.literal("bad"),
  v.literal("neutral"),
  v.literal("moody"),
  v.literal("great")
);

const trendDirectionValidator = v.union(
  v.literal("improving"),
  v.literal("stable"),
  v.literal("declining")
);

export default defineSchema({
  // ── Users (will be replaced by authTables when auth is wired) ──
  users: defineTable({
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    image: v.optional(v.string()),
    tokenIdentifier: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"]),

  // ── Extended user profiles ──
  user_profiles: defineTable({
    userId: v.id("users"),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    timezone: v.optional(v.string()),
    locale: v.optional(v.string()),
    updatedAt: v.number(),
  }).index("by_userId", ["userId"]),

  // ── Devices (push tokens, Phase 3+) ──
  devices: defineTable({
    userId: v.id("users"),
    platform: v.union(v.literal("ios"), v.literal("android"), v.literal("web")),
    pushToken: v.string(),
    lastSeenAt: v.number(),
    enabled: v.boolean(),
  })
    .index("by_userId", ["userId"])
    .index("by_pushToken", ["pushToken"]),

  // ── Circles ──
  circles: defineTable({
    name: v.string(),
    ownerUserId: v.id("users"),
    colorTheme: v.optional(v.string()),
    defaultCheckinCadenceHours: v.number(),
    archived: v.boolean(),
    createdAt: v.number(),
  }).index("by_ownerUserId", ["ownerUserId"]),

  // ── Circle Members ──
  circle_members: defineTable({
    circleId: v.id("circles"),
    userId: v.id("users"),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
    status: v.union(v.literal("active"), v.literal("pending"), v.literal("removed")),
    reminderCadenceHours: v.number(),
    reminderHourLocal: v.optional(v.number()),
    reminderMinuteLocal: v.optional(v.number()),
    quietHoursStartLocal: v.optional(v.number()),
    quietHoursEndLocal: v.optional(v.number()),
    joinedAt: v.number(),
  })
    .index("by_circleId", ["circleId"])
    .index("by_userId", ["userId"])
    .index("by_circleId_userId", ["circleId", "userId"]),

  // ── Check-ins ──
  checkins: defineTable({
    circleId: v.id("circles"),
    userId: v.id("users"),
    positivity: v.number(),
    discreteMood: discreteMoodValidator,
    phaseSelections: v.array(phaseSelectionValidator),
    painScore: v.optional(v.number()),
    note: v.optional(v.string()),
    selfieStorageId: v.optional(v.id("_storage")),
    createdAt: v.number(),
    source: v.union(v.literal("dial"), v.literal("manual"), v.literal("import")),
    idempotencyKey: v.string(),
  })
    .index("by_circleId_userId_createdAt", ["circleId", "userId", "createdAt"])
    .index("by_userId_createdAt", ["userId", "createdAt"])
    .index("by_circleId_createdAt", ["circleId", "createdAt"])
    .index("by_idempotencyKey", ["idempotencyKey"]),

  // ── Member State (denormalized read model) ──
  member_state: defineTable({
    circleId: v.id("circles"),
    userId: v.id("users"),
    latestCheckinId: v.optional(v.id("checkins")),
    latestPositivity: v.optional(v.number()),
    latestDiscreteMood: v.optional(discreteMoodValidator),
    latestPainScore: v.optional(v.number()),
    latestPhaseSelections: v.optional(v.array(phaseSelectionValidator)),
    lastCheckinAt: v.optional(v.number()),
    nextDueAt: v.optional(v.number()),
    status: v.union(
      v.literal("checked_in"),
      v.literal("due_soon"),
      v.literal("overdue"),
      v.literal("stale"),
      v.literal("pending")
    ),
    needsCheckup: v.boolean(),
    hasRecentSelfie: v.boolean(),
    lastSelfieAt: v.optional(v.number()),
    trendDirectionMood: v.optional(trendDirectionValidator),
    trendDirectionPain: v.optional(trendDirectionValidator),
    updatedAt: v.number(),
  })
    .index("by_circleId", ["circleId"])
    .index("by_circleId_status", ["circleId", "status"])
    .index("by_circleId_nextDueAt", ["circleId", "nextDueAt"])
    .index("by_userId", ["userId"])
    .index("by_circleId_userId", ["circleId", "userId"]),

  // ── Trend Daily Buckets ──
  member_trend_daily: defineTable({
    circleId: v.id("circles"),
    userId: v.id("users"),
    dayKey: v.string(),
    moodAvg: v.number(),
    moodMin: v.number(),
    moodMax: v.number(),
    painAvg: v.optional(v.number()),
    sampleCount: v.number(),
    updatedAt: v.number(),
  }).index("by_circleId_userId_dayKey", ["circleId", "userId", "dayKey"]),

  // ── Trend Snapshots (Phase 4) ──
  member_trend_snapshot: defineTable({
    circleId: v.id("circles"),
    userId: v.id("users"),
    windowDays: v.number(),
    moodPoints: v.array(v.object({ dayKey: v.string(), value: v.optional(v.number()) })),
    painPoints: v.optional(v.array(v.object({ dayKey: v.string(), value: v.optional(v.number()) }))),
    moodDirection: v.optional(trendDirectionValidator),
    painDirection: v.optional(trendDirectionValidator),
    lastComputedAt: v.number(),
  }).index("by_circleId_userId_windowDays", ["circleId", "userId", "windowDays"]),

  // ── Nudges (Phase 3) ──
  nudges: defineTable({
    circleId: v.id("circles"),
    fromUserId: v.id("users"),
    toUserId: v.id("users"),
    type: v.union(v.literal("checkup"), v.literal("selfie")),
    status: v.union(v.literal("queued"), v.literal("sent"), v.literal("acked"), v.literal("failed"), v.literal("expired")),
    cooldownKey: v.string(),
    payload: v.optional(v.any()),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_circleId_toUserId_createdAt", ["circleId", "toUserId", "createdAt"])
    .index("by_toUserId_status", ["toUserId", "status"])
    .index("by_cooldownKey", ["cooldownKey"]),

  // ── Notification Outbox (Phase 3) ──
  notification_outbox: defineTable({
    recipientUserId: v.id("users"),
    channel: v.union(v.literal("push"), v.literal("email"), v.literal("inapp")),
    template: v.string(),
    payload: v.any(),
    dedupeKey: v.string(),
    status: v.union(v.literal("pending"), v.literal("sending"), v.literal("sent"), v.literal("failed"), v.literal("dead")),
    attempts: v.number(),
    nextAttemptAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
    sentAt: v.optional(v.number()),
  })
    .index("by_recipientUserId_status", ["recipientUserId", "status"])
    .index("by_status_nextAttemptAt", ["status", "nextAttemptAt"])
    .index("by_dedupeKey", ["dedupeKey"]),

  // ── Selfie Staging (Phase 5) ──
  selfie_staging: defineTable({
    userId: v.id("users"),
    circleId: v.id("circles"),
    storageId: v.id("_storage"),
    status: v.union(v.literal("staged"), v.literal("committed"), v.literal("expired"), v.literal("deleted")),
    createdAt: v.number(),
    expiresAt: v.number(),
    committedCheckinId: v.optional(v.id("checkins")),
  })
    .index("by_userId_status", ["userId", "status"])
    .index("by_expiresAt", ["expiresAt"])
    .index("by_storageId", ["storageId"]),

  // ── Invitations (Phase 6) ──
  invitations: defineTable({
    circleId: v.id("circles"),
    inviterUserId: v.id("users"),
    inviteeUserId: v.optional(v.id("users")),
    inviteeEmail: v.optional(v.string()),
    inviteePhoneE164: v.optional(v.string()),
    channel: v.union(v.literal("email"), v.literal("sms"), v.literal("both")),
    role: v.union(v.literal("admin"), v.literal("member")),
    status: v.union(v.literal("pending"), v.literal("accepted"), v.literal("revoked"), v.literal("expired")),
    tokenHash: v.string(),
    tokenExpiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
    createdAt: v.number(),
    lastSentAt: v.optional(v.number()),
    sendCount: v.number(),
  })
    .index("by_circleId_status", ["circleId", "status"])
    .index("by_inviteeEmail_status", ["inviteeEmail", "status"])
    .index("by_inviteePhoneE164_status", ["inviteePhoneE164", "status"])
    .index("by_tokenHash", ["tokenHash"]),

  // ── User Contacts (Phase 6) ──
  user_contacts: defineTable({
    userId: v.id("users"),
    type: v.union(v.literal("email"), v.literal("phone")),
    valueCanonical: v.string(),
    verified: v.boolean(),
    verifiedAt: v.optional(v.number()),
    primary: v.boolean(),
  })
    .index("by_userId_type", ["userId", "type"])
    .index("by_type_valueCanonical", ["type", "valueCanonical"]),

  // ── Activity Events (audit log) ──
  activity_events: defineTable({
    circleId: v.id("circles"),
    actorUserId: v.id("users"),
    type: v.string(),
    targetUserId: v.optional(v.id("users")),
    refId: v.optional(v.string()),
    payload: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_circleId_createdAt", ["circleId", "createdAt"]),
});
