import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { normalizeEmail } from "./lib/bookings";

export const submitLead = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const email = normalizeEmail(args.email);
    const leadId = await ctx.db.insert("contactLeads", {
      name: args.name,
      email,
      message: args.message,
      status: "new",
      source: "website",
      createdAt: now,
      updatedAt: now,
    });

    return { leadId };
  },
});

export const submitComplaint = mutation({
  args: {
    name: v.string(),
    contactInfo: v.string(),
    details: v.string(),
    bookingReference: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const complaintId = await ctx.db.insert("complaints", {
      name: args.name,
      contactInfo: args.contactInfo.trim(),
      details: args.details,
      bookingReference: args.bookingReference?.trim() || undefined,
      status: "new",
      createdAt: now,
      updatedAt: now,
    });

    return { complaintId };
  },
});

export const subscribeNewsletter = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const existing = await ctx.db.query("newsletterSubscribers").withIndex("by_email", (q) => q.eq("email", email)).first();
    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { updatedAt: now });
      return { created: false };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email,
      createdAt: now,
      updatedAt: now,
    });

    return { created: true };
  },
});
