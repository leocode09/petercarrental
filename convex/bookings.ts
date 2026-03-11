import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { applyDiscount, calculateBookingDays, dateRangeOverlaps, generateBookingReference, isBookingBlockingAvailability, isPromoActive, matchesVehicleService, normalizeCode, normalizeEmail } from "./lib/bookings";
import { bookingStatusValidator } from "./lib/validators";

function findMatchingPricingRule(
  pricingRules: Awaited<ReturnType<typeof collectPricingRules>>,
  {
    vehicleCategory,
    serviceType,
    pickupDate,
  }: {
    vehicleCategory: string;
    serviceType: string;
    pickupDate: string;
  },
) {
  return pricingRules.find((rule) => {
    if (!rule.active) {
      return false;
    }

    if (rule.category && rule.category !== vehicleCategory) {
      return false;
    }

    if (rule.serviceType && rule.serviceType !== serviceType) {
      return false;
    }

    return pickupDate >= rule.startDate && pickupDate <= rule.endDate;
  });
}

async function collectPricingRules(ctx: QueryCtx | MutationCtx) {
  return await ctx.db.query("pricingRules").collect();
}

async function resolveAvailability(
  ctx: QueryCtx | MutationCtx,
  {
    pickupDate,
    returnDate,
    serviceType,
    vehicleCategory,
    selectedVehicleId,
  }: {
    pickupDate: string;
    returnDate: string;
    serviceType: string;
    vehicleCategory: string;
    selectedVehicleId?: string;
  },
) {
  const [vehicles, bookings] = await Promise.all([
    ctx.db.query("vehicles").collect(),
    ctx.db.query("bookings").collect(),
  ]);

  const unavailableVehicleIds = new Set(
    bookings
      .filter(
        (booking) =>
          booking.selectedVehicleId &&
          isBookingBlockingAvailability(booking.status) &&
          dateRangeOverlaps(booking.pickupDate, booking.returnDate, pickupDate, returnDate),
      )
      .map((booking) => booking.selectedVehicleId as string),
  );

  let matchingVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.availabilityStatus === "available" &&
      !unavailableVehicleIds.has(vehicle.publicId) &&
      matchesVehicleService(vehicle, serviceType) &&
      (vehicleCategory === "All" || vehicleCategory === "Any Category" || vehicle.category === vehicleCategory),
  );

  if (selectedVehicleId) {
    matchingVehicles = matchingVehicles.filter((vehicle) => vehicle.publicId === selectedVehicleId);
  }

  matchingVehicles.sort((left, right) => left.pricePerDay - right.pricePerDay || left.sortOrder - right.sortOrder);

  return matchingVehicles;
}

export const availabilityPreview = query({
  args: {
    pickupDate: v.string(),
    returnDate: v.string(),
    serviceType: v.string(),
    vehicleCategory: v.string(),
    selectedVehicleId: v.optional(v.string()),
    promoCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const matchingVehicles = await resolveAvailability(ctx, args);
    const dayCount = calculateBookingDays(args.pickupDate, args.returnDate);
    const pricingRules = await collectPricingRules(ctx);
    const pricingRule = findMatchingPricingRule(pricingRules, args);
    const baseVehicle = matchingVehicles[0];
    const pricePerDay = baseVehicle?.pricePerDay ?? 0;
    const multiplier = pricingRule?.rateMultiplier ?? 1;
    const rawTotal = Math.round(pricePerDay * multiplier * dayCount);

    const promoCode = args.promoCode
      ? await ctx.db.query("promoCodes").withIndex("by_code", (q) => q.eq("code", normalizeCode(args.promoCode!))).first()
      : null;
    const validPromo = isPromoActive(promoCode) ? promoCode : null;
    const { discountedTotal, discountAmount, promoApplied } = applyDiscount(rawTotal, validPromo);

    return {
      availableCount: matchingVehicles.length,
      dayCount,
      pricePerDay: Math.round(pricePerDay * multiplier),
      totalEstimate: discountedTotal,
      discountAmount,
      promoApplied,
      promoCode: validPromo?.code ?? null,
      pricingRuleLabel: pricingRule?.name ?? null,
      highlightedVehicles: matchingVehicles.slice(0, 3).map((vehicle) => ({
        id: vehicle.publicId,
        name: vehicle.name,
        category: vehicle.category,
        pricePerDay: vehicle.pricePerDay,
      })),
    };
  },
});

export const submitPublicBooking = mutation({
  args: {
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
    airportTransfer: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const matchingVehicles = await resolveAvailability(ctx, args);
    const selectedVehicle = args.selectedVehicleId
      ? matchingVehicles.find((vehicle) => vehicle.publicId === args.selectedVehicleId)
      : matchingVehicles[0];
    const pricingRules = await collectPricingRules(ctx);
    const pricingRule = findMatchingPricingRule(pricingRules, {
      vehicleCategory: selectedVehicle?.category ?? args.vehicleCategory,
      serviceType: args.serviceType,
      pickupDate: args.pickupDate,
    });
    const pricePerDay = selectedVehicle?.pricePerDay ?? 0;
    const multiplier = pricingRule?.rateMultiplier ?? 1;
    const dayCount = calculateBookingDays(args.pickupDate, args.returnDate);
    const rawTotal = Math.round(pricePerDay * multiplier * dayCount);
    const promoCode = args.promoCode
      ? await ctx.db.query("promoCodes").withIndex("by_code", (q) => q.eq("code", normalizeCode(args.promoCode!))).first()
      : null;
    const validPromo = isPromoActive(promoCode) ? promoCode : null;
    const pricing = applyDiscount(rawTotal, validPromo);

    const existingCustomer = await ctx.db.query("customers").withIndex("by_email", (q) => q.eq("email", email)).first();
    const now = Date.now();
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

    const reference = generateBookingReference();
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
      vehicleCategory: selectedVehicle?.category ?? args.vehicleCategory,
      selectedVehicleId: selectedVehicle?.publicId,
      serviceType: args.serviceType,
      promoCode: validPromo?.code,
      promoCodeApplied: pricing.promoApplied,
      airportTransfer: args.airportTransfer,
      notes: args.notes,
      source: "website",
      status: "new",
      totalEstimate: pricing.discountedTotal,
      pricingRuleLabel: pricingRule?.name,
      adminNotes: undefined,
      createdAt: now,
      updatedAt: now,
    });

    if (validPromo) {
      await ctx.db.patch(validPromo._id, {
        usedCount: validPromo.usedCount + 1,
        updatedAt: now,
      });
    }

    return {
      bookingId,
      reference,
      selectedVehicleId: selectedVehicle?.publicId ?? null,
      totalEstimate: pricing.discountedTotal,
      dayCount,
      pricePerDay,
      promoCodeApplied: pricing.promoApplied,
    };
  },
});

export const lookupPublicBooking = query({
  args: {
    reference: v.optional(v.string()),
    email: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const normalizedReference = args.reference?.trim().toUpperCase();
    const normalizedEmail = args.email?.trim().toLowerCase();

    if (!normalizedReference && !normalizedEmail) {
      return null;
    }

    const matches = await ctx.db.query("bookings").collect();
    const found = matches
      .filter((booking) => {
        const matchesReference = normalizedReference ? booking.reference.toUpperCase() === normalizedReference : true;
        const matchesEmail = normalizedEmail ? booking.email === normalizedEmail : true;
        return matchesReference && matchesEmail;
      })
      .sort((left, right) => right.updatedAt - left.updatedAt)[0];

    return found ?? null;
  },
});

export const updatePublicBooking = mutation({
  args: {
    reference: v.string(),
    email: v.string(),
    fullName: v.string(),
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
    airportTransfer: v.boolean(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const email = normalizeEmail(args.email);
    const booking = await ctx.db.query("bookings").withIndex("by_reference", (q) => q.eq("reference", args.reference)).first();

    if (!booking || booking.email !== email) {
      throw new Error("Booking not found.");
    }

    const matchingVehicles = await resolveAvailability(ctx, args);
    const selectedVehicle = args.selectedVehicleId
      ? matchingVehicles.find((vehicle) => vehicle.publicId === args.selectedVehicleId)
      : matchingVehicles[0];
    const pricingRules = await collectPricingRules(ctx);
    const pricingRule = findMatchingPricingRule(pricingRules, {
      vehicleCategory: selectedVehicle?.category ?? args.vehicleCategory,
      serviceType: args.serviceType,
      pickupDate: args.pickupDate,
    });
    const pricePerDay = selectedVehicle?.pricePerDay ?? 0;
    const dayCount = calculateBookingDays(args.pickupDate, args.returnDate);
    const rawTotal = Math.round(pricePerDay * (pricingRule?.rateMultiplier ?? 1) * dayCount);
    const promoCode = args.promoCode
      ? await ctx.db.query("promoCodes").withIndex("by_code", (q) => q.eq("code", normalizeCode(args.promoCode!))).first()
      : null;
    const validPromo = isPromoActive(promoCode) ? promoCode : null;
    const pricing = applyDiscount(rawTotal, validPromo);
    const now = Date.now();

    await ctx.db.patch(booking._id, {
      fullName: args.fullName,
      phone: args.phone,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      pickupDate: args.pickupDate,
      returnDate: args.returnDate,
      pickupTime: args.pickupTime,
      vehicleCategory: selectedVehicle?.category ?? args.vehicleCategory,
      selectedVehicleId: selectedVehicle?.publicId,
      serviceType: args.serviceType,
      promoCode: validPromo?.code,
      promoCodeApplied: pricing.promoApplied,
      airportTransfer: args.airportTransfer,
      notes: args.notes,
      status: booking.status === "confirmed" ? "change_requested" : "new",
      totalEstimate: pricing.discountedTotal,
      pricingRuleLabel: pricingRule?.name,
      updatedAt: now,
    });

    const customer = booking.customerId ? await ctx.db.get(booking.customerId) : null;
    if (customer) {
      await ctx.db.patch(customer._id, {
        fullName: args.fullName,
        phone: args.phone,
        updatedAt: now,
      });
    }

    return {
      reference: booking.reference,
      status: booking.status === "confirmed" ? ("change_requested" as const) : ("new" as const),
      selectedVehicleId: selectedVehicle?.publicId ?? null,
      totalEstimate: pricing.discountedTotal,
    };
  },
});

export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: bookingStatusValidator,
    adminNotes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.bookingId, {
      status: args.status,
      adminNotes: args.adminNotes,
      updatedAt: Date.now(),
    });
  },
});
