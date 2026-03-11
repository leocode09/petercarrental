import { v } from "convex/values";

export const userRoles = ["superAdmin", "manager", "operations", "contentEditor"] as const;
export const bookingStatuses = [
  "new",
  "confirmed",
  "change_requested",
  "in_progress",
  "completed",
  "cancelled",
  "refunded",
] as const;
export const availabilityStatuses = ["available", "reserved", "maintenance"] as const;
export const leadStatuses = ["new", "in_progress", "resolved"] as const;
export const complaintStatuses = ["new", "investigating", "resolved", "closed"] as const;
export const customerTypes = ["individual", "corporate", "vip"] as const;
export const discountTypes = ["percentage", "fixed"] as const;
export const siteSettingKey = "primary";

export const userRoleValidator = v.union(
  v.literal("superAdmin"),
  v.literal("manager"),
  v.literal("operations"),
  v.literal("contentEditor"),
);
export const bookingStatusValidator = v.union(
  v.literal("new"),
  v.literal("confirmed"),
  v.literal("change_requested"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("cancelled"),
  v.literal("refunded"),
);
export const availabilityStatusValidator = v.union(
  v.literal("available"),
  v.literal("reserved"),
  v.literal("maintenance"),
);
export const leadStatusValidator = v.union(
  v.literal("new"),
  v.literal("in_progress"),
  v.literal("resolved"),
);
export const complaintStatusValidator = v.union(
  v.literal("new"),
  v.literal("investigating"),
  v.literal("resolved"),
  v.literal("closed"),
);
export const customerTypeValidator = v.union(
  v.literal("individual"),
  v.literal("corporate"),
  v.literal("vip"),
);
export const discountTypeValidator = v.union(v.literal("percentage"), v.literal("fixed"));

export const linkItemValidator = v.object({
  label: v.string(),
  to: v.string(),
  description: v.optional(v.string()),
});

export const navLinkValidator = v.object({
  label: v.string(),
  to: v.string(),
  description: v.optional(v.string()),
  children: v.optional(v.array(linkItemValidator)),
});

export const leadershipMemberValidator = v.object({
  name: v.string(),
  title: v.string(),
  bio: v.string(),
});

export const blogSectionValidator = v.object({
  heading: v.string(),
  body: v.string(),
});

export const companyInfoValidator = v.object({
  name: v.string(),
  defaultTitle: v.string(),
  shortDescription: v.string(),
  metaDescription: v.string(),
  phoneDisplay: v.string(),
  phoneNumber: v.string(),
  email: v.string(),
  whatsappNumber: v.string(),
  locationShort: v.string(),
  locationFull: v.string(),
  canonicalUrl: v.string(),
  liveUrl: v.string(),
  heroImage: v.string(),
  ogImage: v.string(),
  telHref: v.string(),
  mailtoHref: v.string(),
  whatsappHref: v.string(),
  whatsappShareHref: v.string(),
});

export const serviceIconKeyValidator = v.union(
  v.literal("selfDrive"),
  v.literal("chauffeur"),
  v.literal("airport"),
  v.literal("corporate"),
  v.literal("longTerm"),
  v.literal("safari"),
  v.literal("events"),
);

export type UserRole = (typeof userRoles)[number];
export type BookingStatus = (typeof bookingStatuses)[number];
export type AvailabilityStatus = (typeof availabilityStatuses)[number];
export type LeadStatus = (typeof leadStatuses)[number];
export type ComplaintStatus = (typeof complaintStatuses)[number];
export type CustomerType = (typeof customerTypes)[number];
export type DiscountType = (typeof discountTypes)[number];
