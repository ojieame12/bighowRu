import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Resolve the authenticated user or throw.
 *
 * Dev mode: uses ctx.auth.getUserIdentity() if available,
 * falls back to first user in the DB for testing.
 *
 * Production: will use @convex-dev/auth identity.
 */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();

  if (identity) {
    // Production path: resolve from auth identity
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();
    if (!user) throw new Error("User not found");
    return user;
  }

  throw new Error("Not authenticated");
}

/**
 * Get user by ID directly (for dev/testing bypassing auth).
 */
export async function getUserById(ctx: QueryCtx | MutationCtx, userId: Id<"users">) {
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");
  return user;
}

/**
 * Verify the user is an active member of the given circle.
 */
export async function requireCircleMember(
  ctx: QueryCtx | MutationCtx,
  circleId: Id<"circles">,
  userId: Id<"users">
) {
  const member = await ctx.db
    .query("circle_members")
    .withIndex("by_circleId_userId", (q) =>
      q.eq("circleId", circleId).eq("userId", userId)
    )
    .unique();

  if (!member || member.status !== "active") {
    throw new Error("Not a member of this circle");
  }

  return member;
}
