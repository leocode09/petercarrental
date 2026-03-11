import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { generateBookingReference, normalizeEmail } from "./lib/bookings";
import { bookingStatusValidator } from "./lib/validators";

const reservationAccessRoles = ["superAdmin", "manager", "operations"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, reservationAccessRoles);
    const bookings = await ctx.db.query("bookings").collect();
    return bookings.sort((left, right) => right.updatedAt - left.updatedAt);
  },
});

export const upsert = mutation({
  args: {
    bookingId: v.optional(v.id("bookings")),
    reference: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, reservationAccessRoles);
    const email = normalizeEmail(args.email);
    const now = Date.now();
    const existingCustomer = await ctx.db.query("customers").withIndex("by_email", (q) => q.eq("email", email)).first();
    const customerId =
      existingCustomer?._id ??
      (await ctx.db.insert("customers", {
        email,
        fullName: args.fullName,
        phone: args.phone,
        type: "individual",
        tags: [],
        notes: undefined,
        createdAt: now,
        updatedAt: now,
      }));

    if (existingCustomer) {
      await ctx.db.patch(existingCustomer._id, {
        fullName: args.fullName,
        phone: args.phone,
        updatedAt: now,
      });
    }

    if (args.bookingId) {
      const booking = await ctx.db.get(args.bookingId);
      if (!booking) {
        throw new ConvexError("Booking not found.");
      }

      await ctx.db.patch(args.bookingId, {
        reference: args.reference ?? booking.reference,
        customerId,
        fullName: args.fullName,
        email,
        phone: args.phone,
        pickupLocation: args.pickupLocation,
        dropoffLocation: args.dropoffLocation,
        pickupDate: args.pickupDate,
        returnDate: args.returnDate,
        pickupTime: args.pickupTime,
        vehicleCategory: args.vehicleCategory,
        selectedVehicleId: args.selectedVehicleId,
        serviceType: args.serviceType,
        promoCode: args.promoCode,
        promoCodeApplied: args.promoCodeApplied,
        airportTransfer: args.airportTransfer,
        notes: args.notes,
        source: args.source,
        status: args.status,
        totalEstimate: args.totalEstimate,
        pricingRuleLabel: args.pricingRuleLabel,
        adminNotes: args.adminNotes,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "booking.updated",
        entityType: "bookings",
        entityId: args.bookingId,
        summary: `Updated booking ${args.reference ?? booking.reference}.`,
      });

      return { bookingId: args.bookingId, reference: args.reference ?? booking.reference };
    }

    const reference = args.reference?.trim() || generateBookingReference();
    const bookingId = await ctx.db.insert("bookings", {
      reference,
      customerId,
      fullName: args.fullName,
      email,
      phone: args.phone,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      pickupDate: args.pickupDate,
      returnDate: args.returnDate,
      pickupTime: args.pickupTime,
      vehicleCategory: args.vehicleCategory,
      selectedVehicleId: args.selectedVehicleId,
      serviceType: args.serviceType,
      promoCode: args.promoCode,
      promoCodeApplied: args.promoCodeApplied,
      airportTransfer: args.airportTransfer,
      notes: args.notes,
      source: args.source,
      status: args.status,
      totalEstimate: args.totalEstimate,
      pricingRuleLabel: args.pricingRuleLabel,
      adminNotes: args.adminNotes,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "booking.created",
      entityType: "bookings",
      entityId: bookingId,
      summary: `Created booking ${reference}.`,
    });

    return { bookingId, reference };
  },
});
