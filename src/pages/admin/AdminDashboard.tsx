import AdminMetricCard from "../../components/admin/AdminMetricCard";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { getDashboardOverview } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { formatCurrency } from "../../lib/utils";

export default function AdminDashboard() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data } = useFirestoreQuery(getDashboardOverview);

  if (authLoading || !adminUser?.role || !data) {
    return <div className="text-sm text-slate-500">Loading dashboard...</div>;
  }

  return (
    <AdminPageShell
      description="Monitor live operations, booking pressure, fleet utilization, inbox load, and recent admin activity from one place."
      title="Dashboard"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AdminMetricCard hint="Open or active reservations requiring attention." label="Active bookings" value={data.metrics.activeBookings} />
        <AdminMetricCard hint="Upcoming pickups on the current planning horizon." label="Upcoming pickups" value={data.metrics.upcomingPickups} />
        <AdminMetricCard hint="Vehicles currently tied up by active bookings." label="Fleet utilization" value={`${data.metrics.fleetUtilizationRate}%`} />
        <AdminMetricCard hint="Customer issues still waiting on resolution." label="Unresolved complaints" value={data.metrics.unresolvedComplaints} />
        <AdminMetricCard hint="Open contact requests from the website." label="Open leads" value={data.metrics.openLeads} />
        <AdminMetricCard hint="Gross booking estimate across non-cancelled bookings." label="Revenue snapshot" value={formatCurrency(data.metrics.revenueSnapshot)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-black text-slate-950">Upcoming pickups</h2>
          <div className="mt-4 space-y-3">
            {data.upcomingPickups.map((booking) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={booking.reference}>
                <div className="font-semibold text-slate-950">{booking.reference}</div>
                <div className="mt-1">{booking.fullName}</div>
                <div>{booking.pickupDate} at {booking.pickupTime}</div>
                <div>{booking.pickupLocation}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-black text-slate-950">Upcoming returns</h2>
          <div className="mt-4 space-y-3">
            {data.nextReturns.map((booking) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={booking.reference}>
                <div className="font-semibold text-slate-950">{booking.reference}</div>
                <div className="mt-1">{booking.fullName}</div>
                <div>Return {booking.returnDate}</div>
                <div>{booking.dropoffLocation}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 xl:col-span-1">
          <h2 className="text-xl font-black text-slate-950">Recent activity</h2>
          <div className="mt-4 space-y-3">
            {data.recentActivity.map((item) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={(item as { id?: string }).id}>
                <div className="font-semibold text-slate-950">{(item as { action?: string }).action}</div>
                <div className="mt-1 leading-6">{(item as { summary?: string }).summary}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminPageShell>
  );
}
