import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listServices, upsertService } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { usePublicSiteData } from "../../lib/publicData";
import { parseLineList, stringifyLineList } from "../../lib/adminForms";
import { inputClassName, textareaClassName } from "../../lib/utils";

const iconKeys = ["selfDrive", "chauffeur", "airport", "corporate", "longTerm", "safari", "events"] as const;

const emptyForm = {
  serviceId: undefined as string | undefined,
  slug: "",
  name: "",
  description: "",
  route: "",
  menuLabel: "",
  shortDescription: "",
  teaser: "",
  longDescription: "",
  iconKey: "selfDrive",
  heroImage: "",
  idealForText: "",
  inclusionsText: "",
  recommendedVehicleIdsText: "",
  featured: true,
  hideFromMenu: false,
  sortOrder: 0,
};

export default function AdminServices() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: services, refetch } = useFirestoreQuery(listServices);
  const { vehicles = [] } = usePublicSiteData();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      await upsertService(adminUser._id, {
        serviceId: form.serviceId,
        slug: form.slug,
        name: form.name,
        description: form.description || undefined,
        route: form.route || undefined,
        menuLabel: form.menuLabel || undefined,
        shortDescription: form.shortDescription || undefined,
        teaser: form.teaser || undefined,
        longDescription: form.longDescription || undefined,
        iconKey: form.iconKey,
        heroImage: form.heroImage || undefined,
        idealFor: parseLineList(form.idealForText),
        inclusions: parseLineList(form.inclusionsText),
        recommendedVehicleIds: parseLineList(form.recommendedVehicleIdsText),
        featured: form.featured,
        hideFromMenu: form.hideFromMenu,
        sortOrder: Number(form.sortOrder),
      });
      setForm({ ...emptyForm, sortOrder: services?.length ?? 0 });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Manage service offerings: self-drive, chauffeur, airport transfers, corporate, safari, and more."
      title="Services"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Service records</h2>
              <p className="mt-2 text-sm text-slate-600">{services?.length ?? 0} services synced with the public site.</p>
            </div>
            <Button onClick={() => setForm({ ...emptyForm, sortOrder: services?.length ?? 0 })} type="button" variant="outline">
              New Service
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {services?.map((svc) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={svc.id}
                onClick={() =>
                  setForm({
                    serviceId: svc.id,
                    slug: (svc as { slug?: string }).slug ?? "",
                    name: (svc as { name?: string }).name ?? "",
                    description: (svc as { description?: string }).description ?? "",
                    route: (svc as { route?: string }).route ?? "",
                    menuLabel: (svc as { menuLabel?: string }).menuLabel ?? "",
                    shortDescription: (svc as { shortDescription?: string }).shortDescription ?? "",
                    teaser: (svc as { teaser?: string }).teaser ?? "",
                    longDescription: (svc as { longDescription?: string }).longDescription ?? "",
                    iconKey: (svc as { iconKey?: string }).iconKey ?? "selfDrive",
                    heroImage: (svc as { heroImage?: string }).heroImage ?? "",
                    idealForText: stringifyLineList((svc as { idealFor?: string[] }).idealFor),
                    inclusionsText: stringifyLineList((svc as { inclusions?: string[] }).inclusions),
                    recommendedVehicleIdsText: stringifyLineList((svc as { recommendedVehicleIds?: string[] }).recommendedVehicleIds),
                    featured: (svc as { featured?: boolean }).featured ?? true,
                    hideFromMenu: (svc as { hideFromMenu?: boolean }).hideFromMenu ?? false,
                    sortOrder: (svc as { sortOrder?: number }).sortOrder ?? 0,
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{(svc as { name?: string }).name ?? svc.id}</div>
                  <div className="mt-1 text-sm text-slate-600">{(svc as { slug?: string }).slug ?? ""}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.serviceId ? "Edit service" : "Create service"}</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
                placeholder="Slug (e.g. self-drive)"
                value={form.slug}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))}
                placeholder="Name"
                value={form.name}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, menuLabel: e.target.value }))}
                placeholder="Menu label"
                value={form.menuLabel}
              />
              <select
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, iconKey: e.target.value as (typeof iconKeys)[number] }))}
                value={form.iconKey}
              >
                {iconKeys.map((k) => (
                  <option key={k} value={k}>
                    {k}
                  </option>
                ))}
              </select>
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, sortOrder: Number(e.target.value) }))}
                placeholder="Sort order"
                type="number"
                value={form.sortOrder}
              />
            </div>

            <input
              className={inputClassName}
              onChange={(e) => setForm((c) => ({ ...c, heroImage: e.target.value }))}
              placeholder="Hero image URL"
              value={form.heroImage}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))}
              placeholder="Short description"
              value={form.shortDescription}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, teaser: e.target.value }))}
              placeholder="Teaser"
              value={form.teaser}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, longDescription: e.target.value }))}
              placeholder="Long description"
              value={form.longDescription}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, idealForText: e.target.value }))}
              placeholder="Ideal for (one per line)"
              value={form.idealForText}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, inclusionsText: e.target.value }))}
              placeholder="Inclusions (one per line)"
              value={form.inclusionsText}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, recommendedVehicleIdsText: e.target.value }))}
              placeholder={`Recommended vehicle IDs (one per line)\n${vehicles.map((v) => (v as { publicId?: string }).publicId ?? v.id).join("\n")}`}
              value={form.recommendedVehicleIdsText}
            />

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                checked={form.featured}
                onChange={(e) => setForm((c) => ({ ...c, featured: e.target.checked }))}
                type="checkbox"
              />
              Featured
            </label>
            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                checked={form.hideFromMenu}
                onChange={(e) => setForm((c) => ({ ...c, hideFromMenu: e.target.checked }))}
                type="checkbox"
              />
              Hide from menu
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.serviceId ? "Update Service" : "Create Service"}
              </Button>
              <Button onClick={() => setForm({ ...emptyForm, sortOrder: services?.length ?? 0 })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
