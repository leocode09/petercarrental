import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
import type { UserRole } from "./validators";

type ConvexFunctionCtx = QueryCtx | MutationCtx;

export type AdminUserDoc = Doc<"users"> & { role?: UserRole };

export async function requireViewer(ctx: ConvexFunctionCtx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("You must be signed in to access the admin portal.");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new ConvexError("Your account could not be found.");
  }

  return user as AdminUserDoc;
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
