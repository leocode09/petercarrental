import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  availabilityStatusValidator,
  blogSectionValidator,
  bookingStatusValidator,
  companyInfoValidator,
  complaintStatusValidator,
  customerTypeValidator,
  discountTypeValidator,
  leadershipMemberValidator,
  leadStatusValidator,
  linkItemValidator,
  navLinkValidator,
  serviceIconKeyValidator,
  userRoleValidator,
} from "./lib/validators";

export default defineSchema({
  siteSettings: defineTable({
    key: v.string(),
    companyInfo: companyInfoValidator,
    bookingLocations: v.array(v.string()),
    serviceTypes: v.array(v.string()),
    navLinks: v.array(navLinkValidator),
    quickLinks: v.array(linkItemValidator),
    footerServiceLinks: v.array(linkItemValidator),
    legalLinks: v.array(linkItemValidator),
    leadershipMembers: v.array(leadershipMemberValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  vehicles: defineTable({
    publicId: v.string(),
    sortOrder: v.number(),
    name: v.string(),
    category: v.string(),
    pricePerDay: v.number(),
    transmission: v.string(),
    seats: v.number(),
    luggage: v.number(),
    drive: v.string(),
    fuel: v.string(),
    description: v.string(),
    image: v.string(),
    featured: v.boolean(),
    badge: v.optional(v.string()),
    availabilityStatus: availabilityStatusValidator,
    maintenanceNotes: v.optional(v.string()),
    serviceSlugs: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publicId", ["publicId"])
    .index("by_category", ["category"])
    .index("by_featured", ["featured"])
    .index("by_availabilityStatus", ["availabilityStatus"]),

  services: defineTable({
    slug: v.string(),
    route: v.string(),
    aliases: v.optional(v.array(v.string())),
    name: v.string(),
    menuLabel: v.string(),
    shortDescription: v.string(),
    teaser: v.string(),
    longDescription: v.string(),
    iconKey: serviceIconKeyValidator,
    heroImage: v.string(),
    idealFor: v.array(v.string()),
    inclusions: v.array(v.string()),
    featured: v.boolean(),
    hideFromMenu: v.optional(v.boolean()),
    recommendedVehicleIds: v.array(v.string()),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_featured", ["featured"]),

  destinations: defineTable({
    slug: v.string(),
    route: v.string(),
    aliases: v.optional(v.array(v.string())),
    name: v.string(),
    tagline: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    highlights: v.array(v.string()),
    bestVehicleId: v.string(),
    serviceSlug: v.string(),
    image: v.string(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_serviceSlug", ["serviceSlug"]),

  blogPosts: defineTable({
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    category: v.string(),
    readingTime: v.string(),
    date: v.string(),
    image: v.string(),
    highlights: v.array(v.string()),
    sections: v.array(blogSectionValidator),
    published: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["published"]),

  testimonials: defineTable({
    publicId: v.string(),
    author: v.string(),
    quote: v.string(),
    summary: v.string(),
    featured: v.boolean(),
    sortOrder: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_publicId", ["publicId"])
    .index("by_featured", ["featured"]),

  customers: defineTable({
    email: v.string(),
    fullName: v.string(),
    phone: v.optional(v.string()),
    type: customerTypeValidator,
    tags: v.array(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_type", ["type"]),

  bookings: defineTable({
    reference: v.string(),
    customerId: v.optional(v.id("customers")),
    fullName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    pickupLocation: v.string(),
    dropoffLocation: v.string(),
    pickupDate: v.string(),
    returnDate: v.string(),
    pickupTime: v.string(),
    vehicleCategory: v.string(),
    selectedVehicleId: v.optional(v.string()),
    serviceType: v.string(),
    promoCode: v.optional(v.string()),
    promoCodeApplied: v.optional(v.boolean()),
    airportTransfer: v.boolean(),
    notes: v.optional(v.string()),
    source: v.string(),
    status: bookingStatusValidator,
    totalEstimate: v.optional(v.number()),
    pricingRuleLabel: v.optional(v.string()),
    adminNotes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_reference", ["reference"])
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_pickupDate", ["pickupDate"])
    .index("by_customerId", ["customerId"]),

  pricingRules: defineTable({
    name: v.string(),
    category: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    rateMultiplier: v.number(),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_active", ["active"])
    .index("by_category", ["category"]),

  promoCodes: defineTable({
    code: v.string(),
    description: v.string(),
    discountType: discountTypeValidator,
    amount: v.number(),
    active: v.boolean(),
    startsAt: v.optional(v.number()),
    endsAt: v.optional(v.number()),
    usageLimit: v.optional(v.number()),
    usedCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["active"]),

  contactLeads: defineTable({
    name: v.string(),
    email: v.string(),
    message: v.string(),
    status: leadStatusValidator,
    source: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  complaints: defineTable({
    name: v.string(),
    contactInfo: v.string(),
    details: v.string(),
    bookingReference: v.optional(v.string()),
    status: complaintStatusValidator,
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_contactInfo", ["contactInfo"])
    .index("by_status", ["status"])
    .index("by_bookingReference", ["bookingReference"]),

  newsletterSubscribers: defineTable({
    email: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_email", ["email"]),

  activityLogs: defineTable({
    actorUserId: v.optional(v.string()),
    action: v.string(),
    entityType: v.string(),
    entityId: v.optional(v.string()),
    summary: v.string(),
    createdAt: v.number(),
  })
    .index("by_entityType", ["entityType"])
    .index("by_actorUserId", ["actorUserId"]),
});
