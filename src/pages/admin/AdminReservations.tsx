import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { getVehicleCategoriesFromList, usePublicSiteData } from "../../lib/publicData";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyReservationForm = {
  bookingId: undefined as string | undefined,
  reference: "",
  fullName: "",
  email: "",
  phone: "",
  pickupLocation: "Kigali Airport",
  dropoffLocation: "Same as pickup",
  pickupDate: "",
  returnDate: "",
  pickupTime: "09:00",
  vehicleCategory: "SUV",
  selectedVehicleId: "",
  serviceType: "Self-Drive",
  promoCode: "",
  promoCodeApplied: false,
  airportTransfer: false,
  notes: "",
  source: "admin",
  status: "confirmed" as
    | "new"
    | "confirmed"
    | "change_requested"
    | "in_progress"
    | "completed"
    | "cancelled"
    | "refunded",
  totalEstimate: 0,
  pricingRuleLabel: "",
  adminNotes: "",
};

export default function AdminReservations() {
  const bookings = useQuery(api.adminReservations.list, {});
  const upsertBooking = useMutation(api.adminReservations.upsert);
  const { vehicles, bookingLocations, serviceTypes } = usePublicSiteData();
  const vehicleCategories = getVehicleCategoriesFromList(vehicles);
  const [form, setForm] = useState(emptyReservationForm);
  const [saving, setSaving] = useState(false);

  return (
    <AdminPageShell
      description="Create, edit, confirm, or close bookings while keeping references, notes, estimates, and pickup logistics aligned."
      title="Reservations"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Booking queue</h2>
              <p className="mt-2 text-sm text-slate-600">{bookings?.length ?? 0} booking records are available.</p>
            </div>
            <Button onClick={() => setForm(emptyReservationForm)} type="button" variant="outline">
              New Booking
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {bookings?.map((booking) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={booking._id}
                onClick={() =>
                  setForm({
                    bookingId: booking._id,
                    reference: booking.reference,
                    fullName: booking.fullName,
                    email: booking.email,
                    phone: booking.phone ?? "",
                    pickupLocation: booking.pickupLocation,
                    dropoffLocation: booking.dropoffLocation,
                    pickupDate: booking.pickupDate,
                    returnDate: booking.returnDate,
                    pickupTime: booking.pickupTime,
                    vehicleCategory: booking.vehicleCategory,
                    selectedVehicleId: booking.selectedVehicleId ?? "",
                    serviceType: booking.serviceType,
                    promoCode: booking.promoCode ?? "",
                    promoCodeApplied: booking.promoCodeApplied ?? false,
                    airportTransfer: booking.airportTransfer,
                    notes: booking.notes ?? "",
                    source: booking.source,
                    status: booking.status,
                    totalEstimate: booking.totalEstimate ?? 0,
                    pricingRuleLabel: booking.pricingRuleLabel ?? "",
                    adminNotes: booking.adminNotes ?? "",
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{booking.reference}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {booking.fullName} · {booking.pickupDate} · {booking.status}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{booking.source}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.bookingId ? "Edit booking" : "Create booking"}</h2>
          <form
            className="mt-6 space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              setSaving(true);

              void upsertBooking({
                bookingId: form.bookingId as never,
                reference: form.reference || undefined,
                fullName: form.fullName,
                email: form.email,
                phone: form.phone || undefined,
                pickupLocation: form.pickupLocation,
                dropoffLocation: form.dropoffLocation,
                pickupDate: form.pickupDate,
                returnDate: form.returnDate,
                pickupTime: form.pickupTime,
                vehicleCategory: form.vehicleCategory,
                selectedVehicleId: form.selectedVehicleId || undefined,
                serviceType: form.serviceType,
                promoCode: form.promoCode || undefined,
                promoCodeApplied: form.promoCodeApplied || undefined,
                airportTransfer: form.airportTransfer,
                notes: form.notes || undefined,
                source: form.source,
                status: form.status,
                totalEstimate: Number(form.totalEstimate) || undefined,
                pricingRuleLabel: form.pricingRuleLabel || undefined,
                adminNotes: form.adminNotes || undefined,
              })
                .then((result) =>
                  setForm((current) => ({
                    ...current,
                    bookingId: result.bookingId as never,
                    reference: result.reference,
                  })),
                )
                .finally(() => setSaving(false));
            }}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, reference: event.target.value }))} placeholder="Reference (optional)" value={form.reference} />
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as typeof current.status }))} value={form.status}>
                <option value="new">new</option>
                <option value="confirmed">confirmed</option>
                <option value="change_requested">change_requested</option>
                <option value="in_progress">in_progress</option>
                <option value="completed">completed</option>
                <option value="cancelled">cancelled</option>
                <option value="refunded">refunded</option>
              </select>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))} placeholder="Customer name" value={form.fullName} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} placeholder="Customer email" type="email" value={form.email} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} placeholder="Phone" value={form.phone} />
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, source: event.target.value }))} value={form.source}>
                <option value="website">website</option>
                <option value="admin">admin</option>
                <option value="phone">phone</option>
                <option value="whatsapp">whatsapp</option>
              </select>
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pickupLocation: event.target.value }))} value={form.pickupLocation}>
                {bookingLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, dropoffLocation: event.target.value }))} value={form.dropoffLocation}>
                {bookingLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pickupDate: event.target.value }))} type="date" value={form.pickupDate} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, returnDate: event.target.value }))} type="date" value={form.returnDate} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pickupTime: event.target.value }))} type="time" value={form.pickupTime} />
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, serviceType: event.target.value }))} value={form.serviceType}>
                {serviceTypes.map((serviceType) => (
                  <option key={serviceType} value={serviceType}>
                    {serviceType}
                  </option>
                ))}
              </select>
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, vehicleCategory: event.target.value }))} value={form.vehicleCategory}>
                {vehicleCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, selectedVehicleId: event.target.value }))} value={form.selectedVehicleId}>
                <option value="">Any vehicle</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle._id ?? vehicle.id} value={vehicle.publicId ?? vehicle.id}>
                    {vehicle.name}
                  </option>
                ))}
              </select>
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, totalEstimate: Number(event.target.value) }))} placeholder="Total estimate" type="number" value={form.totalEstimate} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, pricingRuleLabel: event.target.value }))} placeholder="Pricing rule label" value={form.pricingRuleLabel} />
              <input className={inputClassName} onChange={(event) => setForm((current) => ({ ...current, promoCode: event.target.value }))} placeholder="Promo code" value={form.promoCode} />
            </div>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input checked={form.promoCodeApplied} onChange={(event) => setForm((current) => ({ ...current, promoCodeApplied: event.target.checked }))} type="checkbox" />
              Promo code applied
            </label>

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input checked={form.airportTransfer} onChange={(event) => setForm((current) => ({ ...current, airportTransfer: event.target.checked }))} type="checkbox" />
              Airport support required
            </label>

            <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Customer notes" value={form.notes} />
            <textarea className={textareaClassName} onChange={(event) => setForm((current) => ({ ...current, adminNotes: event.target.value }))} placeholder="Internal admin notes" value={form.adminNotes} />

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.bookingId ? "Update Booking" : "Create Booking"}
              </Button>
              <Button onClick={() => setForm(emptyReservationForm)} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
