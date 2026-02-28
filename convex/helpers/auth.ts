import { QueryCtx, MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Resolve the authenticated user or throw.
 * Uses @convex-dev/auth identity: tokenIdentifier → users table lookup.
 */
export async function requireUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated");

  // @convex-dev/auth stores user docs in `users` table.
  // The subject field is the user's _id in string form.
  const userId = identity.subject as Id<"users">;
  const user = await ctx.db.get(userId);
  if (!user) throw new Error("User not found");

  return { ...user, _id: userId };
}

/**
 * Get the authenticated user's ID, or null if not authenticated.
 */
export async function getAuthUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return identity.subject as Id<"users">;
}

/**
 * Verify the user is an active member of the given circle.
 * Returns the membership record.
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
