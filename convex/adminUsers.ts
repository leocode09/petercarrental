import { api, components } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { authComponent, createAuth } from "./auth";
import { getViewer, logActivity, requireRole } from "./lib/auth";
import { normalizeEmail } from "./lib/bookings";
import { userRoles, userRoleValidator, type UserRole } from "./lib/validators";

function isAdminRole(role: string | null | undefined): role is UserRole {
  return userRoles.includes(role as UserRole);
}

export const authState = query({
  args: {},
  handler: async (ctx) => {
    const user = await getViewer(ctx);
    const authUsers = await ctx.runQuery(components.betterAuth.users.listUsers, {});
    const hasAnyAdmin = authUsers.some((candidate: { role?: string | null }) =>
      isAdminRole(candidate.role),
    );

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
    const authUsers = await ctx.runQuery(components.betterAuth.users.listUsers, {});
    const someoneHasRole = authUsers.some((user: { role?: string | null }) => isAdminRole(user.role));
    if (someoneHasRole) {
      throw new ConvexError("An admin with a role already exists. Use Users & Roles to assign yours.");
    }

    await ctx.runMutation(components.betterAuth.users.updateUserRole, {
      userId: viewer._id,
      role: "superAdmin",
    });
  },
});

export const createFirstAdmin = action({
  args: {
    name: v.string(),
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<{ userId: string }> => {
    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters.");
    }

    const authUsers = await ctx.runQuery(components.betterAuth.users.listUsers, {});
    const hasAnyAdmin = authUsers.some((user: { role?: string | null }) => isAdminRole(user.role));
    if (hasAnyAdmin) {
      throw new ConvexError("An admin account already exists.");
    }

    const email = normalizeEmail(args.email);
    const existingUser = await ctx.runQuery(components.betterAuth.users.getUserByEmail, {
      email,
    });

    if (existingUser) {
      await ctx.runMutation(components.betterAuth.users.updateUserRole, {
        userId: existingUser._id,
        role: "superAdmin",
      });

      return { userId: existingUser._id };
    }

    const { auth } = await authComponent.getAuth(createAuth, ctx);

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          name: args.name,
          password: args.password,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create the admin account.";
      throw new ConvexError(message);
    }

    const createdUser = await ctx.runQuery(components.betterAuth.users.getUserByEmail, {
      email,
    });

    if (!createdUser) {
      throw new ConvexError("The created admin user could not be found in Better Auth.");
    }

    await ctx.runMutation(components.betterAuth.users.updateUserRole, {
      userId: createdUser._id,
      role: "superAdmin",
    });

    return { userId: createdUser._id };
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
    return await ctx.runQuery(components.betterAuth.users.listUsers, {});
  },
});

export const updateRole = mutation({
  args: {
    userId: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, ["superAdmin"]);
    const user = await ctx.runQuery(components.betterAuth.users.getUserById, {
      userId: args.userId,
    });

    if (!user) {
      throw new ConvexError("User not found.");
    }

    if (viewer._id === user._id && args.role !== "superAdmin") {
      throw new ConvexError("You cannot remove your own super admin access.");
    }

    await ctx.runMutation(components.betterAuth.users.updateUserRole, {
      userId: user._id,
      role: args.role,
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
    actorUserId: v.optional(v.string()),
    createdUserId: v.string(),
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
  handler: async (ctx, args): Promise<{ userId: string }> => {
    const viewer = await ctx.runQuery(api.adminUsers.currentAdmin, {});
    if (!viewer?.role || !["superAdmin", "manager"].includes(viewer.role)) {
      throw new ConvexError("You do not have permission to create admin users.");
    }

    if (args.password.length < 8) {
      throw new ConvexError("Password must be at least 8 characters.");
    }

    const email = normalizeEmail(args.email);
    const existingUser = await ctx.runQuery(components.betterAuth.users.getUserByEmail, {
      email,
    });
    if (existingUser) {
      throw new ConvexError("An admin with this email already exists.");
    }

    const { auth } = await authComponent.getAuth(createAuth, ctx);

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          name: args.name,
          password: args.password,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to create the admin account.";
      if (message.toLowerCase().includes("already exists")) {
        throw new ConvexError("An admin with this email already exists.");
      }
      throw new ConvexError(message);
    }

    const createdUser = await ctx.runQuery(components.betterAuth.users.getUserByEmail, {
      email,
    });

    if (!createdUser) {
      throw new ConvexError("The created admin user could not be found in Better Auth.");
    }

    await ctx.runMutation(components.betterAuth.users.updateUserRole, {
      userId: createdUser._id,
      role: args.role,
    });

    await ctx.runMutation(api.adminUsers.recordUserCreation, {
      actorUserId: viewer._id,
      createdUserId: createdUser._id,
      email,
      role: args.role,
    });

    return {
      userId: createdUser._id,
    };
  },
});
