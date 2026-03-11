import { createAccount, getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { normalizeEmail } from "./lib/bookings";
import { userRoleValidator } from "./lib/validators";

export const authState = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    const hasAnyAdmin = (await ctx.db.query("users").collect()).length > 0;

    return {
      hasAnyAdmin,
      viewer: user,
    };
  },
});

export const currentAdmin = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db.get(userId);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["superAdmin", "manager"]);
    const users = await ctx.db.query("users").collect();

    return users.sort((left, right) => (left.createdAt ?? 0) - (right.createdAt ?? 0));
  },
});

export const updateRole = mutation({
  args: {
    userId: v.id("users"),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, ["superAdmin"]);
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User not found.");
    }

    if (viewer._id === user._id && args.role !== "superAdmin") {
      throw new ConvexError("You cannot remove your own super admin access.");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "user.role.updated",
      entityType: "users",
      entityId: user._id,
      summary: `Updated ${user.email ?? user.name ?? "admin user"} to role ${args.role}.`,
    });
  },
});

export const recordUserCreation = mutation({
  args: {
    actorUserId: v.optional(v.id("users")),
    createdUserId: v.id("users"),
    email: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    await logActivity(ctx, {
      actorUserId: args.actorUserId,
      action: "user.created",
      entityType: "users",
      entityId: args.createdUserId,
      summary: `Created admin account for ${args.email} with role ${args.role}.`,
    });
  },
});

export const createAdminUser = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await ctx.runQuery(api.adminUsers.currentAdmin, {});
    if (!viewer?.role || !["superAdmin", "manager"].includes(viewer.role)) {
      throw new ConvexError("You do not have permission to create admin users.");
    }

    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters.");
    }

    const email = normalizeEmail(args.email);
    const existingUsers = await ctx.runQuery(api.adminUsers.list, {});
    const existingUser = existingUsers.find((user) => user.email?.toLowerCase() === email);
    if (existingUser) {
      throw new ConvexError("An admin with this email already exists.");
    }

    const { user } = await createAccount(ctx, {
      provider: "admin-credentials",
      account: {
        id: email,
        secret: args.password,
      },
      profile: {
        email,
        name: args.name,
        role: args.role,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      shouldLinkViaEmail: true,
    });

    await ctx.runMutation(api.adminUsers.recordUserCreation, {
      actorUserId: viewer._id,
      createdUserId: user._id,
      email,
      role: args.role,
    });

    return {
      userId: user._id,
    };
  },
});
