import AdminPageShell from "../../components/admin/AdminPageShell";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import {
  listInbox,
  updateLeadStatus,
  updateComplaintStatus,
} from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";

export default function AdminInbox() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: inbox, refetch } = useFirestoreQuery(listInbox);

  const handleLeadStatus = async (leadId: string, status: "new" | "in_progress" | "resolved") => {
    if (!adminUser) return;
    await updateLeadStatus(adminUser._id, leadId, status);
    await refetch();
  };

  const handleComplaintStatus = async (
    complaintId: string,
    status: "new" | "investigating" | "resolved" | "closed"
  ) => {
    if (!adminUser) return;
    await updateComplaintStatus(adminUser._id, complaintId, status);
    await refetch();
  };

  if (authLoading || !inbox) {
    return <div className="text-sm text-slate-500">Loading inbox...</div>;
  }

  return (
    <AdminPageShell
      description="Handle incoming website leads, service complaints, and newsletter opt-ins from a single operational inbox."
      title="Inbox"
    >
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Contact leads</h2>
          <div className="mt-6 space-y-3">
            {inbox.leads.map((lead) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700" key={lead.id}>
                <div className="font-semibold text-slate-950">{lead.name}</div>
                <div className="mt-1">{lead.email}</div>
                <p className="mt-3 leading-6">{lead.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["new", "in_progress", "resolved"] as const).map((status) => (
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold transition hover:border-orange-300"
                      key={status}
                      onClick={() => void handleLeadStatus(lead.id, status)}
                      type="button"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Complaints</h2>
          <div className="mt-6 space-y-3">
            {inbox.complaints.map((complaint) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700" key={complaint.id}>
                <div className="font-semibold text-slate-950">{complaint.name}</div>
                <div className="mt-1">{complaint.contactInfo}</div>
                {complaint.bookingReference ? (
                  <div className="mt-1">Reference {complaint.bookingReference}</div>
                ) : null}
                <p className="mt-3 leading-6">{complaint.details}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(["new", "investigating", "resolved", "closed"] as const).map((status) => (
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold transition hover:border-orange-300"
                      key={status}
                      onClick={() => void handleComplaintStatus(complaint.id, status)}
                      type="button"
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Newsletter</h2>
          <div className="mt-6 space-y-3">
            {inbox.newsletterSubscribers.map((subscriber) => (
              <div className="rounded-2xl border border-slate-200 px-4 py-4 text-sm text-slate-700" key={subscriber.id}>
                <div className="font-semibold text-slate-950">{subscriber.email}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Updated {new Date(subscriber.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminPageShell>
  );
}
