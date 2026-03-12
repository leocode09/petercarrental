import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listCustomers, updateCustomer } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { parseLineList, stringifyLineList } from "../../lib/adminForms";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyCustomerForm = {
  customerId: undefined as string | undefined,
  fullName: "",
  phone: "",
  type: "individual" as "individual" | "corporate" | "vip",
  tagsText: "",
  notes: "",
};

export default function AdminCustomers() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: customers, refetch } = useFirestoreQuery(listCustomers);
  const [form, setForm] = useState(emptyCustomerForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerId || !adminUser) return;
    setSaving(true);
    try {
      await updateCustomer(adminUser._id, {
        customerId: form.customerId,
        fullName: form.fullName,
        phone: form.phone || undefined,
        type: form.type,
        tags: parseLineList(form.tagsText),
        notes: form.notes || undefined,
      });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Review the customer base, capture notes, tag corporate or VIP accounts, and keep follow-up context in one place."
      title="Customers"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Customer list</h2>
          <div className="mt-6 space-y-3">
            {customers?.map((customer) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={customer.id}
                onClick={() =>
                  setForm({
                    customerId: customer.id,
                    fullName: customer.fullName,
                    phone: customer.phone ?? "",
                    type: customer.type,
                    tagsText: stringifyLineList(customer.tags),
                    notes: customer.notes ?? "",
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{customer.fullName}</div>
                  <div className="mt-1 text-sm text-slate-600">{customer.email}</div>
                </div>
                <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">
                  {customer.type}
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Customer detail</h2>
          <p className="mt-2 text-sm text-slate-600">Select a customer to update their tags, notes, and account type.</p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Customer name</span>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Customer name" value={form.fullName} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Phone</span>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" value={form.phone} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Customer type</span>
              <select
                className={inputClassName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    type: event.target.value as typeof current.type,
                  }))
                }
                value={form.type}
              >
                <option value="individual">individual</option>
                <option value="corporate">corporate</option>
                <option value="vip">vip</option>
              </select>
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Tags</span>
              <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, tagsText: event.target.value }))} placeholder="Tags, one per line" value={form.tagsText} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Notes</span>
              <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Customer notes" value={form.notes} />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={!form.customerId || saving} type="submit">
                {saving ? "Saving..." : "Update Customer"}
              </Button>
              <Button onClick={() => setForm(emptyCustomerForm)} type="button" variant="outline">
                Clear
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
