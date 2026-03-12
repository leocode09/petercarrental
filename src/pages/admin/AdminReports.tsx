import AdminPageShell from "../../components/admin/AdminPageShell";
import Card from "../../components/ui/Card";
import { getReportsSummary } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";

export default function AdminReports() {
  const { data: report } = useFirestoreQuery(getReportsSummary);

  if (!report) {
    return <div className="text-sm text-slate-500">Loading reports...</div>;
  }

  return (
    <AdminPageShell
      description="Review booking distribution, demand by source and category, lead resolution, and which vehicles are carrying the workload."
      title="Reports"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Bookings by status</h2>
          <div className="mt-6 space-y-3">
            {report.bookingsByStatus.map((item) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={item.status}>
                <span className="font-semibold text-slate-950">{item.status}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Bookings by source</h2>
          <div className="mt-6 space-y-3">
            {report.bookingsBySource.map((item) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={item.source}>
                <span className="font-semibold text-slate-950">{item.source}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Bookings by category</h2>
          <div className="mt-6 space-y-3">
            {report.bookingsByCategory.map((item) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={item.category}>
                <span className="font-semibold text-slate-950">{item.category}</span>
                <span>{item.count}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Vehicle performance</h2>
          <div className="mt-6 space-y-3">
            {report.vehiclePerformance.map((item) => (
              <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700" key={item.vehicleId}>
                <span className="font-semibold text-slate-950">{item.vehicleName}</span>
                <span>{item.bookings} bookings</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500">Lead count</p>
          <div className="mt-3 text-3xl font-black text-slate-950">{report.leadCount}</div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500">Resolved leads</p>
          <div className="mt-3 text-3xl font-black text-slate-950">{report.resolvedLeadCount}</div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500">Complaint count</p>
          <div className="mt-3 text-3xl font-black text-slate-950">{report.complaintCount}</div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-semibold text-slate-500">Resolved complaints</p>
          <div className="mt-3 text-3xl font-black text-slate-950">{report.resolvedComplaintCount}</div>
        </Card>
      </div>
    </AdminPageShell>
  );
}
