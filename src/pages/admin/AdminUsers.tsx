import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { inputClassName } from "../../lib/utils";

const emptyUserForm = {
  name: "",
  email: "",
  password: "",
  role: "operations" as "superAdmin" | "manager" | "operations" | "contentEditor",
};

export default function AdminUsers() {
  const users = useQuery(api.adminUsers.list, {});
  const viewer = useQuery(api.adminUsers.currentAdmin, {});
  const createAdminUser = useAction(api.adminUsers.createAdminUser);
  const updateRole = useMutation(api.adminUsers.updateRole);
  const [form, setForm] = useState(emptyUserForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <AdminPageShell
      description="Control admin access, provision new team accounts, and assign operational or editorial permissions by role."
      title="Users & Roles"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Current admin users</h2>
          <div className="mt-6 space-y-3">
            {users?.map((user) => (
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between" key={user._id}>
                <div>
                  <div className="font-semibold text-slate-950">{user.name || user.email || "Admin"}</div>
                  <div className="mt-1 text-sm text-slate-600">{user.email}</div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["superAdmin", "manager", "operations", "contentEditor"] as const).map((role) => (
                    <button
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        user.role === role
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-slate-200 text-slate-600 hover:border-orange-300"
                      }`}
                      disabled={viewer?.role !== "superAdmin"}
                      key={role}
                      onClick={() => void updateRole({ userId: user._id, role })}
                      type="button"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Create admin user</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);
              setErrorMessage("");

              void createAdminUser(form)
                .then(() => setForm(emptyUserForm))
                .catch((error) => {
                  setErrorMessage(error instanceof Error ? error.message : "Unable to create the admin account.");
                })
                .finally(() => setSaving(false));
            }}
          >
            <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Display name" value={form.name} />
            <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Admin email" type="email" value={form.email} />
            <input className={inputClassName} minLength={8} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} placeholder="Temporary password" type="password" value={form.password} />
            <select
              className={inputClassName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  role: event.target.value as typeof current.role,
                }))
              }
              value={form.role}
            >
              <option value="operations">operations</option>
              <option value="contentEditor">contentEditor</option>
              <option value="manager">manager</option>
              <option value="superAdmin">superAdmin</option>
            </select>
            {errorMessage ? <p className="text-sm text-rose-600">{errorMessage}</p> : null}
            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Creating..." : "Create Admin User"}
              </Button>
              <Button onClick={() => setForm(emptyUserForm)} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
