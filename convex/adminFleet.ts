import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import { availabilityStatusValidator } from "./lib/validators";

const fleetAccessRoles = ["superAdmin", "manager", "operations"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, fleetAccessRoles);
    const vehicles = await ctx.db.query("vehicles").collect();
    return vehicles.sort((left, right) => left.sortOrder - right.sortOrder);
  },
});

export const upsert = mutation({
  args: {
    vehicleId: v.optional(v.id("vehicles")),
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
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, fleetAccessRoles);
    const now = Date.now();

    const duplicate = await ctx.db
      .query("vehicles")
      .withIndex("by_publicId", (q) => q.eq("publicId", args.publicId))
      .first();

    if (duplicate && duplicate._id !== args.vehicleId) {
      throw new ConvexError("A vehicle with this public ID already exists.");
    }

    if (args.vehicleId) {
      const existingVehicle = await ctx.db.get(args.vehicleId);
      if (!existingVehicle) {
        throw new ConvexError("Vehicle not found.");
      }

      await ctx.db.patch(args.vehicleId, {
        publicId: args.publicId,
        sortOrder: args.sortOrder,
        name: args.name,
        category: args.category,
        pricePerDay: args.pricePerDay,
        transmission: args.transmission,
        seats: args.seats,
        luggage: args.luggage,
        drive: args.drive,
        fuel: args.fuel,
        description: args.description,
        image: args.image,
        featured: args.featured,
        badge: args.badge,
        availabilityStatus: args.availabilityStatus,
        maintenanceNotes: args.maintenanceNotes,
        serviceSlugs: args.serviceSlugs,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "vehicle.updated",
        entityType: "vehicles",
        entityId: args.vehicleId,
        summary: `Updated vehicle ${args.name}.`,
      });

      return { vehicleId: args.vehicleId };
    }

    const vehicleId = await ctx.db.insert("vehicles", {
      publicId: args.publicId,
      sortOrder: args.sortOrder,
      name: args.name,
      category: args.category,
      pricePerDay: args.pricePerDay,
      transmission: args.transmission,
      seats: args.seats,
      luggage: args.luggage,
      drive: args.drive,
      fuel: args.fuel,
      description: args.description,
      image: args.image,
      featured: args.featured,
      badge: args.badge,
      availabilityStatus: args.availabilityStatus,
      maintenanceNotes: args.maintenanceNotes,
      serviceSlugs: args.serviceSlugs,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "vehicle.created",
      entityType: "vehicles",
      entityId: vehicleId,
      summary: `Created vehicle ${args.name}.`,
    });

    return { vehicleId };
  },
});
