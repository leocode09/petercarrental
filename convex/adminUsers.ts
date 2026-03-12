import { ConvexError, v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";
import { authComponent, createAuth } from "./auth";
import { getViewer, logActivity, requireRole } from "./lib/auth";
import { normalizeEmail } from "./lib/bookings";
import { userRoleValidator } from "./lib/validators";

export const authState = query({
  args: {},
  handler: async (ctx) => {
    const user = await getViewer(ctx);
    const hasAnyAdmin = (await ctx.db.query("users").collect()).some((candidate) => Boolean(candidate.authUserId && candidate.role));

    return {
      hasAnyAdmin,
      viewer: user,
    };
  },
});

/** Bootstrap role for first admin when trigger didn't assign one (e.g. migration edge case). */
export const bootstrapFirstAdminRole = mutation({
  args: {},
  handler: async (ctx) => {
    const viewer = await getViewer(ctx);
    if (!viewer) {
      throw new ConvexError("You must be signed in.");
    }
    if (viewer.role) {
      return; // Already has role
    }
    if (!viewer.authUserId) {
      throw new ConvexError("Only linked auth users can be bootstrapped.");
    }
    const allUsers = await ctx.db.query("users").collect();
    const someoneHasRole = allUsers.some((u) => Boolean(u.authUserId && u.role));
    if (someoneHasRole) {
      throw new ConvexError("An admin with a role already exists. Use Users & Roles to assign yours.");
    }
    await ctx.db.patch(viewer._id, {
      role: "superAdmin",
      updatedAt: Date.now(),
    });
  },
});

export const currentAdmin = query({
  args: {},
  handler: async (ctx) => {
    return await getViewer(ctx);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, ["superAdmin", "manager"]);
    const users = (await ctx.db.query("users").collect()).filter((user) => Boolean(user.authUserId));

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

export const setRoleByAuthUserId = internalMutation({
  args: {
    authUserId: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", args.authUserId))
      .unique();

    if (!user) {
      throw new ConvexError("The created admin user could not be linked to the app.");
    }

    await ctx.db.patch(user._id, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return user._id;
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

    const { auth } = await authComponent.getAuth(createAuth, ctx);

    let authUserId: string;
    try {
      const created = await auth.api.signUpEmail({
        body: {
          email,
          name: args.name,
          password: args.password,
        },
      });
      authUserId = created.user.id;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create the admin account.";
      if (message.toLowerCase().includes("already exists")) {
        throw new ConvexError("An admin with this email already exists.");
      }
      throw new ConvexError(message);
    }

    const userId = await ctx.runMutation(internal.adminUsers.setRoleByAuthUserId, {
      authUserId,
      role: args.role,
    });

    await ctx.runMutation(api.adminUsers.recordUserCreation, {
      actorUserId: viewer._id,
      createdUserId: userId,
      email,
      role: args.role,
    });

    return {
      userId,
    };
  },
});
