import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listDestinations, upsertDestination } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { usePublicSiteData } from "../../lib/publicData";
import { parseLineList, stringifyLineList } from "../../lib/adminForms";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyForm = {
  destinationId: undefined as string | undefined,
  slug: "",
  name: "",
  tagline: "",
  shortDescription: "",
  longDescription: "",
  highlightsText: "",
  bestVehicleId: "",
  serviceSlug: "",
  image: "",
  sortOrder: 0,
};

export default function AdminDestinations() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: destinations, refetch } = useFirestoreQuery(listDestinations);
  const { vehicles = [], services = [] } = usePublicSiteData();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      await upsertDestination(adminUser._id, {
        destinationId: form.destinationId,
        slug: form.slug,
        name: form.name,
        tagline: form.tagline || undefined,
        shortDescription: form.shortDescription || undefined,
        longDescription: form.longDescription || undefined,
        highlights: parseLineList(form.highlightsText),
        bestVehicleId: form.bestVehicleId || undefined,
        serviceSlug: form.serviceSlug || undefined,
        image: form.image || undefined,
        sortOrder: Number(form.sortOrder),
      });
      setForm({ ...emptyForm, sortOrder: destinations?.length ?? 0 });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Manage destination pages: Kigali, Akagera, Volcanoes, Nyungwe, and custom locations."
      title="Destinations"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Destination records</h2>
              <p className="mt-2 text-sm text-slate-600">{destinations?.length ?? 0} destinations synced with the public site.</p>
            </div>
            <Button onClick={() => setForm({ ...emptyForm, sortOrder: destinations?.length ?? 0 })} type="button" variant="outline">
              New Destination
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {destinations?.map((d) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={d.id}
                onClick={() =>
                  setForm({
                    destinationId: d.id,
                    slug: (d as { slug?: string }).slug ?? "",
                    name: (d as { name?: string }).name ?? "",
                    tagline: (d as { tagline?: string }).tagline ?? "",
                    shortDescription: (d as { shortDescription?: string }).shortDescription ?? "",
                    longDescription: (d as { longDescription?: string }).longDescription ?? "",
                    highlightsText: stringifyLineList((d as { highlights?: string[] }).highlights),
                    bestVehicleId: (d as { bestVehicleId?: string }).bestVehicleId ?? "",
                    serviceSlug: (d as { serviceSlug?: string }).serviceSlug ?? "",
                    image: (d as { image?: string }).image ?? "",
                    sortOrder: (d as { sortOrder?: number }).sortOrder ?? 0,
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{(d as { name?: string }).name ?? d.id}</div>
                  <div className="mt-1 text-sm text-slate-600">{(d as { slug?: string }).slug ?? ""}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.destinationId ? "Edit destination" : "Create destination"}</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Slug</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
                  placeholder="Slug (e.g. kigali)"
                  value={form.slug}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Name</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                  placeholder="Name"
                  value={form.name}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Tagline</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, tagline: e.target.value }))}
                  placeholder="Tagline"
                  value={form.tagline}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Sort order</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, sortOrder: Number(e.target.value) }))}
                  placeholder="Sort order"
                  type="number"
                  value={form.sortOrder}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Best vehicle</span>
                <select
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, bestVehicleId: e.target.value }))}
                  value={form.bestVehicleId}
                >
                  <option value="">Best vehicle</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={(v as { publicId?: string }).publicId ?? v.id}>
                      {(v as { name?: string }).name ?? v.id}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Service</span>
                <select
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, serviceSlug: e.target.value }))}
                  value={form.serviceSlug}
                >
                  <option value="">Service</option>
                  {services.map((s) => (
                    <option key={s.id} value={(s as { slug?: string }).slug ?? s.id}>
                      {(s as { name?: string }).name ?? s.id}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Image URL</span>
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, image: e.target.value }))}
                placeholder="Image URL"
                value={form.image}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Short description</span>
              <textarea
                className={textareaClassName}
                onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))}
                placeholder="Short description"
                value={form.shortDescription}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Long description</span>
              <textarea
                className={textareaClassName}
                onChange={(e) => setForm((c) => ({ ...c, longDescription: e.target.value }))}
                placeholder="Long description"
                value={form.longDescription}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Highlights</span>
              <textarea
                className={textareaClassName}
                onChange={(e) => setForm((c) => ({ ...c, highlightsText: e.target.value }))}
                placeholder="Highlights (one per line)"
                value={form.highlightsText}
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.destinationId ? "Update Destination" : "Create Destination"}
              </Button>
              <Button onClick={() => setForm({ ...emptyForm, sortOrder: destinations?.length ?? 0 })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
