import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { normalizeCode } from "./lib/bookings";
import { discountTypeValidator } from "./lib/validators";

const pricingAccessRoles = ["superAdmin", "manager"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, pricingAccessRoles);
    const [pricingRules, promoCodes] = await Promise.all([
      ctx.db.query("pricingRules").collect(),
      ctx.db.query("promoCodes").collect(),
    ]);

    return {
      pricingRules: pricingRules.sort((left, right) => right.updatedAt - left.updatedAt),
      promoCodes: promoCodes.sort((left, right) => right.updatedAt - left.updatedAt),
    };
  },
});

export const upsertPricingRule = mutation({
  args: {
    pricingRuleId: v.optional(v.id("pricingRules")),
    name: v.string(),
    category: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    rateMultiplier: v.number(),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, pricingAccessRoles);
    const now = Date.now();

    if (args.pricingRuleId) {
      const existingRule = await ctx.db.get(args.pricingRuleId);
      if (!existingRule) {
        throw new ConvexError("Pricing rule not found.");
      }

      await ctx.db.patch(args.pricingRuleId, {
        ...args,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "pricingRule.updated",
        entityType: "pricingRules",
        entityId: args.pricingRuleId,
        summary: `Updated pricing rule ${args.name}.`,
      });

      return { pricingRuleId: args.pricingRuleId };
    }

    const pricingRuleId = await ctx.db.insert("pricingRules", {
      name: args.name,
      category: args.category,
      serviceType: args.serviceType,
      startDate: args.startDate,
      endDate: args.endDate,
      rateMultiplier: args.rateMultiplier,
      active: args.active,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "pricingRule.created",
      entityType: "pricingRules",
      entityId: pricingRuleId,
      summary: `Created pricing rule ${args.name}.`,
    });

    return { pricingRuleId };
  },
});

export const upsertPromoCode = mutation({
  args: {
    promoCodeId: v.optional(v.id("promoCodes")),
    code: v.string(),
    description: v.string(),
    discountType: discountTypeValidator,
    amount: v.number(),
    active: v.boolean(),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, pricingAccessRoles);
    const normalizedCode = normalizeCode(args.code);
    const now = Date.now();
    const duplicate = await ctx.db.query("promoCodes").withIndex("by_code", (q) => q.eq("code", normalizedCode)).first();

    if (duplicate && duplicate._id !== args.promoCodeId) {
      throw new ConvexError("A promo code with this code already exists.");
    }

    if (args.promoCodeId) {
      const existingCode = await ctx.db.get(args.promoCodeId);
      if (!existingCode) {
        throw new ConvexError("Promo code not found.");
      }

      await ctx.db.patch(args.promoCodeId, {
        code: normalizedCode,
        description: args.description,
        discountType: args.discountType,
        amount: args.amount,
        active: args.active,
        startsAt: args.startsAt,
        endsAt: args.endsAt,
        usageLimit: args.usageLimit,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "promoCode.updated",
        entityType: "promoCodes",
        entityId: args.promoCodeId,
        summary: `Updated promo code ${normalizedCode}.`,
      });

      return { promoCodeId: args.promoCodeId };
    }

    const promoCodeId = await ctx.db.insert("promoCodes", {
      code: normalizedCode,
      description: args.description,
      discountType: args.discountType,
      amount: args.amount,
      active: args.active,
      startsAt: args.startsAt,
      endsAt: args.endsAt,
      usageLimit: args.usageLimit,
      usedCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "promoCode.created",
      entityType: "promoCodes",
      entityId: promoCodeId,
      summary: `Created promo code ${normalizedCode}.`,
    });

    return { promoCodeId };
  },
});
