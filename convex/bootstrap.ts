import { mutation, query } from "./_generated/server";
import { companyInfo, bookingLocations, footerServiceLinks, legalLinks, navLinks, quickLinks, serviceTypes } from "../src/data/site";
import { blogPosts } from "../src/data/blog";
import { destinations } from "../src/data/destinations";
import { leadershipMembers } from "../src/data/leadership";
import { services } from "../src/data/services";
import { testimonials } from "../src/data/testimonials";
import { vehicles } from "../src/data/vehicles";
import { siteSettingKey } from "./lib/validators";

function getVehicleServiceSlugs(vehicleId: string) {
  return services
    .filter((service) => service.recommendedVehicleIds.includes(vehicleId))
    .map((service) => service.slug);
}

export const getSeedStatus = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", siteSettingKey)).first();
    const vehicleCount = (await ctx.db.query("vehicles").collect()).length;

    return {
      seeded: Boolean(settings) && vehicleCount > 0,
    };
  },
});

export const seedPublicData = mutation({
  args: {},
  handler: async (ctx) => {
    const existingSettings = await ctx.db
      .query("siteSettings")
      .withIndex("by_key", (q) => q.eq("key", siteSettingKey))
      .first();

    if (existingSettings) {
      return { seeded: false, reason: "already-seeded" as const };
    }

    const now = Date.now();

    await ctx.db.insert("siteSettings", {
      key: siteSettingKey,
      companyInfo,
      bookingLocations,
      serviceTypes,
      navLinks,
      quickLinks,
      footerServiceLinks,
      legalLinks,
      leadershipMembers,
      createdAt: now,
      updatedAt: now,
    });

    for (const [index, vehicle] of vehicles.entries()) {
      await ctx.db.insert("vehicles", {
        publicId: vehicle.id,
        sortOrder: index,
        name: vehicle.name,
        category: vehicle.category,
        pricePerDay: vehicle.pricePerDay,
        transmission: vehicle.transmission,
        seats: vehicle.seats,
        luggage: vehicle.luggage,
        drive: vehicle.drive,
        fuel: vehicle.fuel,
        description: vehicle.description,
        image: vehicle.image,
        featured: vehicle.featured,
        badge: vehicle.badge,
        availabilityStatus: "available",
        maintenanceNotes: undefined,
        serviceSlugs: getVehicleServiceSlugs(vehicle.id),
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const [index, service] of services.entries()) {
      await ctx.db.insert("services", {
        ...service,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const [index, destination] of destinations.entries()) {
      await ctx.db.insert("destinations", {
        ...destination,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const [index, post] of blogPosts.entries()) {
      await ctx.db.insert("blogPosts", {
        ...post,
        published: true,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const [index, testimonial] of testimonials.entries()) {
      await ctx.db.insert("testimonials", {
        publicId: testimonial.id,
        author: testimonial.author,
        quote: testimonial.quote,
        summary: testimonial.summary,
        featured: true,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("pricingRules", {
      name: "Peak season safari uplift",
      category: "4x4 Safari",
      serviceType: undefined,
      startDate: "2026-06-01",
      endDate: "2026-09-30",
      rateMultiplier: 1.15,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("pricingRules", {
      name: "Chauffeur convenience uplift",
      category: undefined,
      serviceType: "With Chauffeur",
      startDate: "2026-01-01",
      endDate: "2026-12-31",
      rateMultiplier: 1.1,
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("promoCodes", {
      code: "WELCOME10",
      description: "10% off first website booking requests.",
      discountType: "percentage",
      amount: 10,
      active: true,
      startsAt: undefined,
      endsAt: undefined,
      usageLimit: 200,
      usedCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("promoCodes", {
      code: "AIRPORT25",
      description: "Flat $25 savings for airport transfer requests.",
      discountType: "fixed",
      amount: 25,
      active: true,
      startsAt: undefined,
      endsAt: undefined,
      usageLimit: undefined,
      usedCount: 0,
      createdAt: now,
      updatedAt: now,
    });

    return { seeded: true, reason: "seeded" as const };
  },
});
