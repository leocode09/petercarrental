import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { usePublicSiteData } from "../../lib/publicData";
import { inputClassName, textareaClassName } from "../../lib/utils";
import { parseLineList, stringifyLineList } from "../../lib/adminForms";

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
  const { services, vehicles } = usePublicSiteData();
  const fleet = useQuery(api.adminFleet.list, {});
  const upsertVehicle = useMutation(api.adminFleet.upsert);
  const [form, setForm] = useState(emptyFleetForm);
  const [saving, setSaving] = useState(false);

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
                key={vehicle._id}
                onClick={() =>
                  setForm({
                    vehicleId: vehicle._id,
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
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);

              void upsertVehicle({
                vehicleId: form.vehicleId as never,
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
              })
                .then(() => setForm({ ...emptyFleetForm, sortOrder: vehicles.length }))
                .finally(() => setSaving(false));
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, publicId: event.target.value }))} placeholder="Public ID" value={form.publicId} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Vehicle name" value={form.name} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} placeholder="Category" value={form.category} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pricePerDay: Number(event.target.value) }))} placeholder="Price per day" type="number" value={form.pricePerDay} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, transmission: event.target.value }))} placeholder="Transmission" value={form.transmission} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, drive: event.target.value }))} placeholder="Drive" value={form.drive} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, fuel: event.target.value }))} placeholder="Fuel" value={form.fuel} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, badge: event.target.value }))} placeholder="Badge" value={form.badge} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, seats: Number(event.target.value) }))} placeholder="Seats" type="number" value={form.seats} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, luggage: Number(event.target.value) }))} placeholder="Luggage" type="number" value={form.luggage} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, sortOrder: Number(event.target.value) }))} placeholder="Sort order" type="number" value={form.sortOrder} />
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
            </div>

            <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, image: event.target.value }))} placeholder="Image URL" value={form.image} />
            <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} placeholder="Vehicle description" value={form.description} />
            <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, maintenanceNotes: event.target.value }))} placeholder="Maintenance notes (optional)" value={form.maintenanceNotes} />
            <textarea
              className={textareaClassName}
              onChange={(event) => setForm((current) => ({ ...current, serviceSlugsText: event.target.value }))}
              placeholder={`Recommended service slugs, one per line\n${services.map((service) => service.slug).join("\n")}`}
              value={form.serviceSlugsText}
            />

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
