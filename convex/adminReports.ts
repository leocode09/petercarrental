import { query } from "./_generated/server";
import { requireRole } from "./lib/auth";

const reportAccessRoles = ["superAdmin", "manager", "operations"] as const;

export const summary = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, reportAccessRoles);

    const [bookings, vehicles, leads, complaints] = await Promise.all([
      ctx.db.query("bookings").collect(),
      ctx.db.query("vehicles").collect(),
      ctx.db.query("contactLeads").collect(),
      ctx.db.query("complaints").collect(),
    ]);

    const bookingsByStatus = Object.entries(
      bookings.reduce<Record<string, number>>((accumulator, booking) => {
        accumulator[booking.status] = (accumulator[booking.status] ?? 0) + 1;
        return accumulator;
      }, {}),
    ).map(([status, count]) => ({ status, count }));

    const bookingsBySource = Object.entries(
      bookings.reduce<Record<string, number>>((accumulator, booking) => {
        accumulator[booking.source] = (accumulator[booking.source] ?? 0) + 1;
        return accumulator;
      }, {}),
    ).map(([source, count]) => ({ source, count }));

    const bookingsByCategory = Object.entries(
      bookings.reduce<Record<string, number>>((accumulator, booking) => {
        accumulator[booking.vehicleCategory] = (accumulator[booking.vehicleCategory] ?? 0) + 1;
        return accumulator;
      }, {}),
    ).map(([category, count]) => ({ category, count }));

    const vehiclePerformance = vehicles.map((vehicle) => ({
      vehicleId: vehicle.publicId,
      vehicleName: vehicle.name,
      bookings: bookings.filter((booking) => booking.selectedVehicleId === vehicle.publicId).length,
    }));

    return {
      bookingsByStatus,
      bookingsBySource,
      bookingsByCategory,
      vehiclePerformance: vehiclePerformance.sort((left, right) => right.bookings - left.bookings),
      leadCount: leads.length,
      complaintCount: complaints.length,
      resolvedLeadCount: leads.filter((lead) => lead.status === "resolved").length,
      resolvedComplaintCount: complaints.filter((complaint) => ["resolved", "closed"].includes(complaint.status)).length,
    };
  },
});
