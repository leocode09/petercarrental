import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listFleet, upsertVehicle } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { usePublicSiteData } from "../../lib/publicData";
import { parseLineList, stringifyLineList } from "../../lib/adminForms";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyFleetForm = {
  vehicleId: undefined as string | undefined,
  publicId: "",
  sortOrder: 0,
  name: "",
  category: "SUV",
  pricePerDay: 0,
  transmission: "Automatic",
  seats: 5,
  luggage: 3,
  drive: "AWD",
  fuel: "Petrol",
  description: "",
  image: "",
  featured: true,
  badge: "",
  availabilityStatus: "available" as "available" | "reserved" | "maintenance",
  maintenanceNotes: "",
  serviceSlugsText: "",
};

export default function AdminFleet() {
  const { services = [], vehicles = [] } = usePublicSiteData();
  const { adminUser, loading: authLoading } = useAuth();
  const { data: fleet, refetch } = useFirestoreQuery(listFleet);
  const [form, setForm] = useState(emptyFleetForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      await upsertVehicle(adminUser._id, {
        vehicleId: form.vehicleId,
        publicId: form.publicId,
        sortOrder: Number(form.sortOrder),
        name: form.name,
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        transmission: form.transmission,
        seats: Number(form.seats),
        luggage: Number(form.luggage),
        drive: form.drive,
        fuel: form.fuel,
        description: form.description,
        image: form.image,
        featured: form.featured,
        badge: form.badge || undefined,
        availabilityStatus: form.availabilityStatus,
        maintenanceNotes: form.maintenanceNotes || undefined,
        serviceSlugs: parseLineList(form.serviceSlugsText),
      });
      setForm({ ...emptyFleetForm, sortOrder: vehicles.length });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Create and maintain the rentable fleet, update imagery and positioning, and mark units as reserved or in maintenance."
      title="Fleet Management"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Fleet records</h2>
              <p className="mt-2 text-sm text-slate-600">{fleet?.length ?? 0} vehicles synced with the public site.</p>
            </div>
            <Button
              onClick={() => setForm({ ...emptyFleetForm, sortOrder: vehicles.length })}
              type="button"
              variant="outline"
            >
              New Vehicle
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {fleet?.map((vehicle) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={vehicle.id}
                onClick={() =>
                  setForm({
                    vehicleId: vehicle.id,
                    publicId: vehicle.publicId,
                    sortOrder: vehicle.sortOrder,
                    name: vehicle.name,
                    category: vehicle.category,
                    pricePerDay: vehicle.pricePerDay,
                    transmission: vehicle.transmission,
                    seats: vehicle.seats,
                    luggage: vehicle.luggage,
                    drive: vehicle.drive,
                    fuel: vehicle.fuel,
                    description: vehicle.description,
                    image: vehicle.image,
                    featured: vehicle.featured,
                    badge: vehicle.badge ?? "",
                    availabilityStatus: vehicle.availabilityStatus,
                    maintenanceNotes: vehicle.maintenanceNotes ?? "",
                    serviceSlugsText: stringifyLineList(vehicle.serviceSlugs),
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{vehicle.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {vehicle.category} · ${vehicle.pricePerDay}/day · {vehicle.availabilityStatus}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{vehicle.publicId}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.vehicleId ? "Edit vehicle" : "Create vehicle"}</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Public ID</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, publicId: event.target.value }))} placeholder="Public ID" value={form.publicId} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Vehicle name</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Vehicle name" value={form.name} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Category</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category" value={form.category} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Price per day</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pricePerDay: Number(event.target.value) }))} placeholder="Price per day" type="number" value={form.pricePerDay} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Transmission</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, transmission: event.target.value }))} placeholder="Transmission" value={form.transmission} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Drive</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, drive: event.target.value }))} placeholder="Drive" value={form.drive} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Fuel</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, fuel: event.target.value }))} placeholder="Fuel" value={form.fuel} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Badge</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} placeholder="Badge" value={form.badge} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Seats</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, seats: Number(event.target.value) }))} placeholder="Seats" type="number" value={form.seats} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Luggage</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, luggage: Number(event.target.value) }))} placeholder="Luggage" type="number" value={form.luggage} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Sort order</span>
                <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} placeholder="Sort order" type="number" value={form.sortOrder} />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Availability status</span>
                <select
                  className={inputClassName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      availabilityStatus: event.target.value as typeof form.availabilityStatus,
                    }))
                  }
                  value={form.availabilityStatus}
                >
                  <option value="available">available</option>
                  <option value="reserved">reserved</option>
                  <option value="maintenance">maintenance</option>
                </select>
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Image URL</span>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="Image URL" value={form.image} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Description</span>
              <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Vehicle description" value={form.description} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Maintenance notes</span>
              <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, maintenanceNotes: event.target.value }))} placeholder="Maintenance notes (optional)" value={form.maintenanceNotes} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Service slugs</span>
              <textarea
                className={textareaClassName}
                onChange={(event) => setForm((current) => ({ ...current, serviceSlugsText: event.target.value }))}
                placeholder={`Recommended service slugs, one per line\n${services.map((s) => s.slug).join("\n")}`}
                value={form.serviceSlugsText}
              />
            </label>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                checked={form.featured}
                onChange={(event) => setForm((current) => ({ ...current, featured: event.target.checked }))}
                type="checkbox"
              />
              Featured on the public site
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.vehicleId ? "Update Vehicle" : "Create Vehicle"}
              </Button>
              <Button onClick={() => setForm({ ...emptyFleetForm, sortOrder: vehicles.length })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
