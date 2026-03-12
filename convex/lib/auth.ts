import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import { authComponent } from "../auth";
import type { UserRole } from "./validators";

type ConvexFunctionCtx = QueryCtx | MutationCtx;

export type AdminUserDoc = Doc<"users"> & { role?: UserRole };

export async function getViewer(ctx: ConvexFunctionCtx) {
  const authUser = await authComponent.safeGetAuthUser(ctx);
  if (!authUser) {
    return null;
  }

  const userId = authUser.userId as Id<"users"> | null | undefined;
  if (userId) {
    const linkedUser = await ctx.db.get(userId);
    if (linkedUser) {
      return linkedUser as AdminUserDoc;
    }
  }

  const linkedUser = await ctx.db
    .query("users")
    .withIndex("by_authUserId", (q) => q.eq("authUserId", authUser._id))
    .unique();

  return (linkedUser as AdminUserDoc | null) ?? null;
}

export async function requireViewer(ctx: ConvexFunctionCtx) {
  const user = await getViewer(ctx);
  if (!user) {
    throw new ConvexError("You must be signed in to access the admin portal.");
  }

  return user;
}

export async function requireRole(ctx: ConvexFunctionCtx, allowedRoles: readonly UserRole[]) {
  const user = await requireViewer(ctx);

  if (!user.role || !allowedRoles.includes(user.role)) {
    throw new ConvexError("You do not have permission to perform this action.");
  }

  return user;
}

export async function logActivity(
  ctx: MutationCtx,
  {
    actorUserId,
    action,
    entityType,
    entityId,
    summary,
  }: {
    actorUserId?: Id<"users">;
    action: string;
    entityType: string;
    entityId?: string;
    summary: string;
  },
) {
  await ctx.db.insert("activityLogs", {
    actorUserId,
    action,
    entityType,
    entityId,
    summary,
    createdAt: Date.now(),
  });
}
