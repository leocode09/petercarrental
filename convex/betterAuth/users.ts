import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { userRoleValidator } from "../lib/validators";

export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("user").collect();
    return users.sort((left, right) => left.createdAt - right.createdAt);
  },
});

export const getUserByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = args.email.trim().toLowerCase();
    const users = await ctx.db.query("user").collect();

    return users.find((user) => user.email.toLowerCase() === normalizedEmail) ?? null;
  },
});

export const getUserById = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId as Id<"user">);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.string(),
    role: userRoleValidator,
  },
  handler: async (ctx, args) => {
    const userId = args.userId as Id<"user">;
    const user = await ctx.db.get(userId);

    if (!user) {
      throw new ConvexError("User not found.");
    }

    await ctx.db.patch(userId, {
      role: args.role,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(userId);
  },
});
