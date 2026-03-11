import { query } from "./_generated/server";
import { requireRole } from "./lib/auth";

const dashboardAccessRoles = ["superAdmin", "manager", "operations", "contentEditor"] as const;

export const overview = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, dashboardAccessRoles);

    const [bookings, vehicles, complaints, leads, activityLogs] = await Promise.all([
      ctx.db.query("bookings").collect(),
      ctx.db.query("vehicles").collect(),
      ctx.db.query("complaints").collect(),
      ctx.db.query("contactLeads").collect(),
      ctx.db.query("activityLogs").collect(),
    ]);

    const activeBookings = bookings.filter((booking) =>
      ["new", "confirmed", "change_requested", "in_progress"].includes(booking.status),
    );
    const unresolvedComplaints = complaints.filter((complaint) =>
      ["new", "investigating"].includes(complaint.status),
    );
    const openLeads = leads.filter((lead) => lead.status !== "resolved");
    const upcomingPickups = [...bookings]
      .sort((left, right) => left.pickupDate.localeCompare(right.pickupDate))
      .slice(0, 5);
    const nextReturns = [...bookings]
      .sort((left, right) => left.returnDate.localeCompare(right.returnDate))
      .slice(0, 5);
    const revenueSnapshot = bookings.reduce((total, booking) => {
      if (["cancelled", "refunded"].includes(booking.status)) {
        return total;
      }

      return total + (booking.totalEstimate ?? 0);
    }, 0);
    const utilizedVehicleIds = new Set(activeBookings.map((booking) => booking.selectedVehicleId).filter(Boolean));
    const recentActivity = activityLogs.sort((left, right) => right.createdAt - left.createdAt).slice(0, 8);

    return {
      metrics: {
        activeBookings: activeBookings.length,
        upcomingPickups: upcomingPickups.length,
        nextReturns: nextReturns.length,
        fleetUtilizationRate: vehicles.length === 0 ? 0 : Math.round((utilizedVehicleIds.size / vehicles.length) * 100),
        unresolvedComplaints: unresolvedComplaints.length,
        openLeads: openLeads.length,
        revenueSnapshot,
      },
      upcomingPickups,
      nextReturns,
      recentActivity,
    };
  },
});
