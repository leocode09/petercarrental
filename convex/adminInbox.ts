import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { complaintStatusValidator, leadStatusValidator } from "./lib/validators";

const inboxAccessRoles = ["superAdmin", "manager", "operations"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, inboxAccessRoles);

    const [leads, complaints, newsletterSubscribers] = await Promise.all([
      ctx.db.query("contactLeads").collect(),
      ctx.db.query("complaints").collect(),
      ctx.db.query("newsletterSubscribers").collect(),
    ]);

    return {
      leads: leads.sort((left, right) => right.updatedAt - left.updatedAt),
      complaints: complaints.sort((left, right) => right.updatedAt - left.updatedAt),
      newsletterSubscribers: newsletterSubscribers.sort((left, right) => right.updatedAt - left.updatedAt),
    };
  },
});

export const updateLeadStatus = mutation({
  args: {
    leadId: v.id("contactLeads"),
    status: leadStatusValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, inboxAccessRoles);
    await ctx.db.patch(args.leadId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "lead.updated",
      entityType: "contactLeads",
      entityId: args.leadId,
      summary: `Updated lead status to ${args.status}.`,
    });
  },
});

export const updateComplaintStatus = mutation({
  args: {
    complaintId: v.id("complaints"),
    status: complaintStatusValidator,
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, inboxAccessRoles);
    await ctx.db.patch(args.complaintId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "complaint.updated",
      entityType: "complaints",
      entityId: args.complaintId,
      summary: `Updated complaint status to ${args.status}.`,
    });
  },
});
