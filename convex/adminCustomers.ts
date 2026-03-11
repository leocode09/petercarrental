import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { customerTypeValidator } from "./lib/validators";

const customerAccessRoles = ["superAdmin", "manager", "operations"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, customerAccessRoles);
    const customers = await ctx.db.query("customers").collect();
    return customers.sort((left, right) => right.updatedAt - left.updatedAt);
  },
});

export const update = mutation({
  args: {
    customerId: v.id("customers"),
    fullName: v.string(),
    phone: v.optional(v.string()),
    type: customerTypeValidator,
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, customerAccessRoles);
    const customer = await ctx.db.get(args.customerId);

    if (!customer) {
      throw new ConvexError("Customer not found.");
    }

    await ctx.db.patch(args.customerId, {
      fullName: args.fullName,
      phone: args.phone,
      type: args.type,
      tags: args.tags,
      notes: args.notes,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "customer.updated",
      entityType: "customers",
      entityId: args.customerId,
      summary: `Updated customer ${args.fullName}.`,
    });
  },
});
