import { ConvexError } from "convex/values";
import { components } from "../_generated/api";
import type { MutationCtx, QueryCtx } from "../_generated/server";
import { authComponent } from "../auth";
import { userRoles, type UserRole } from "./validators";

type ConvexFunctionCtx = QueryCtx | MutationCtx;

function isAdminRole(role: string | null | undefined): role is UserRole {
  return userRoles.includes(role as UserRole);
}

export type AdminUserDoc = {
  _id: string;
  authUserId: string;
  email?: string | null;
  image?: string | null;
  name?: string | null;
  role?: UserRole | null;
};

export async function getViewer(ctx: ConvexFunctionCtx) {
  const authUser = await authComponent.safeGetAuthUser(ctx);
  if (!authUser) {
    return null;
  }

  const betterAuthUser = await ctx.runQuery(components.betterAuth.users.getUserById, {
    userId: authUser._id,
  });

  if (betterAuthUser) {
    return {
      _id: betterAuthUser._id,
      authUserId: betterAuthUser._id,
      email: betterAuthUser.email,
      image: betterAuthUser.image,
      name: betterAuthUser.name,
      role: isAdminRole(betterAuthUser.role) ? betterAuthUser.role : null,
    } satisfies AdminUserDoc;
  }

  return {
    ...authUser,
    authUserId: authUser._id,
    role: isAdminRole(authUser.role) ? authUser.role : null,
  } satisfies AdminUserDoc;
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
    actorUserId?: string;
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
