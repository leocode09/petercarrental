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

export type UserRole = (typeof userRoles)[number];
export type BookingStatus = (typeof bookingStatuses)[number];
export type AvailabilityStatus = (typeof availabilityStatuses)[number];
export type LeadStatus = (typeof leadStatuses)[number];
export type ComplaintStatus = (typeof complaintStatuses)[number];
export type CustomerType = (typeof customerTypes)[number];
export type DiscountType = (typeof discountTypes)[number];

export interface LinkItem {
  label: string;
  to: string;
  description?: string;
}

export interface NavLink {
  label: string;
  to: string;
  description?: string;
  children?: LinkItem[];
}

export interface LeadershipMember {
  name: string;
  title: string;
  bio: string;
}

export interface BlogSection {
  heading: string;
  body: string;
}

export interface CompanyInfo {
  name: string;
  defaultTitle: string;
  shortDescription: string;
  metaDescription: string;
  phoneDisplay: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
  locationShort: string;
  locationFull: string;
  canonicalUrl: string;
  liveUrl: string;
  heroImage: string;
  ogImage: string;
  telHref: string;
  mailtoHref: string;
  whatsappHref: string;
  whatsappShareHref: string;
}

export type ServiceIconKey =
  | "selfDrive"
  | "chauffeur"
  | "airport"
  | "corporate"
  | "longTerm"
  | "safari"
  | "events";
