import { addDays, format } from "date-fns";
import { ShieldCheck, TimerReset, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import { usePublicData } from "../components/providers/PublicDataProvider";
import {
  getVehicleByQueryValue,
  getVehicleCategories,
} from "../lib/firestore-public";
import {
  submitPublicBooking,
  updatePublicBooking,
} from "../lib/firestore-public-booking";
import { buildWhatsAppLink, inputClassName, openWhatsApp, textareaClassName } from "../lib/utils";

const today = new Date();

const reasons = [
  {
    title: "Fast confirmation",
    description: "Send your details directly to our reservations team for quick availability checks.",
    icon: TimerReset,
  },
  {
    title: "Trusted premium service",
    description: "Every rental is backed by professional support, clean vehicles, and transparent pricing.",
    icon: ShieldCheck,
  },
  {
    title: "Flexible payment coordination",
    description: "We tailor the next step based on your travel dates, vehicle class, and delivery preferences.",
    icon: WalletCards,
  },
];

type SubmittedBooking = {
  reference: string;
  fullName: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  vehicleCategory: string;
  selectedVehicleId: string;
  serviceType: string;
  promoCode: string;
  airportTransfer: boolean;
  notes: string;
};

export default function Booking() {
  const { data } = usePublicData();
  const [searchParams] = useSearchParams();
  const vehicles = data?.vehicles ?? [];
  const bookingLocations = data?.bookingLocations ?? [];
  const serviceTypes = data?.serviceTypes ?? [];
  const vehicleCategories = data ? getVehicleCategories(data.vehicles) : [];
  const whatsappNumber = data?.companyInfo.whatsappNumber ?? "";

  const initialVehicle = getVehicleByQueryValue(vehicles, searchParams.get("vehicle"));
  const initialReference = searchParams.get("reference") ?? "";

  const [pickupLocation, setPickupLocation] = useState(searchParams.get("pickupLocation") ?? "Kigali Airport");
  const [dropoffLocation, setDropoffLocation] = useState(searchParams.get("dropoffLocation") ?? "Same as pickup");
  const [pickupDate, setPickupDate] = useState(searchParams.get("pickupDate") ?? format(addDays(today, 1), "yyyy-MM-dd"));
  const [returnDate, setReturnDate] = useState(searchParams.get("returnDate") ?? format(addDays(today, 4), "yyyy-MM-dd"));
  const [pickupTime, setPickupTime] = useState(searchParams.get("pickupTime") ?? "09:00");
  const [vehicleCategory, setVehicleCategory] = useState(
    initialVehicle?.category ?? searchParams.get("category") ?? "Any Category",
  );
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle?.id ?? "");
  const [serviceType, setServiceType] = useState(searchParams.get("serviceType") ?? "Self-Drive");
  const [promoCode, setPromoCode] = useState(searchParams.get("promoCode") ?? "");
  const [airportTransfer, setAirportTransfer] = useState(searchParams.get("airport") === "true");
  const [fullName, setFullName] = useState(searchParams.get("fullName") ?? "");
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [notes, setNotes] = useState(searchParams.get("notes") ?? "");
  const [submittedBooking, setSubmittedBooking] = useState<SubmittedBooking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedVehicle = useMemo(
    () => vehicles.find((v) => v.id === selectedVehicleId),
    [vehicles, selectedVehicleId],
  );
  const submittedVehicle = useMemo(
    () =>
      submittedBooking
        ? vehicles.find((v) => v.id === submittedBooking.selectedVehicleId)
        : undefined,
    [submittedBooking, vehicles],
  );
  const bookingIntent = initialReference ? "update" : "book";
  const latestWhatsAppMessage = submittedBooking
    ? [
        `Hello Peter Car Rental, I would like to ${bookingIntent} a vehicle request.`,
        `Reference: ${submittedBooking.reference}`,
        `Name: ${submittedBooking.fullName || "Not provided"}`,
        `Email: ${submittedBooking.email || "Not provided"}`,
        `Pickup location: ${submittedBooking.pickupLocation}`,
        `Drop-off location: ${submittedBooking.dropoffLocation}`,
        `Pickup date: ${submittedBooking.pickupDate}`,
        `Return date: ${submittedBooking.returnDate}`,
        `Pickup time: ${submittedBooking.pickupTime}`,
        `Specific vehicle: ${submittedVehicle?.name || "Any available vehicle"}`,
        `Vehicle category: ${submittedBooking.vehicleCategory}`,
        `Service type: ${submittedBooking.serviceType}`,
        `Promo code: ${submittedBooking.promoCode || "None"}`,
        `Airport transfer: ${submittedBooking.airportTransfer ? "Yes" : "No"}`,
        `Notes: ${submittedBooking.notes || "None"}`,
      ].join("\n")
    : "";

  if (!data) return null;

  return (
    <>
      <Seo canonicalPath="/booking" title="Book Now | Peter Car Rental" />
      <PageHero
        description="Share your itinerary and we will match you with the right vehicle, service style, and pickup plan."
        eyebrow="Book Now"
        image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=80"
        title="Reserve your Peter Car Rental vehicle"
      />

      <section className="section-space">
        <div className="container-shell grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5 sm:p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Booking Request
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                  {initialReference ? "Update your saved booking request" : "Tell us about your trip"}
                </h2>
                {initialReference ? (
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Reference <span className="font-semibold text-slate-950">{initialReference}</span> —
                    enter your email to verify and update the request.
                  </p>
                ) : null}
              </div>

              {submitError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  {submitError}
                </div>
              ) : null}

              {submittedBooking ? (
                <Card className="border border-emerald-100 bg-emerald-50/80 p-5 shadow-none">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
                        Request Saved
                      </p>
                      <h3 className="mt-2 text-xl font-black text-slate-950">
                        Reference {submittedBooking.reference}
                      </h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Your request has been saved and the WhatsApp draft has been opened for confirmation.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                      <Button
                        to={`/manage-booking?reference=${encodeURIComponent(submittedBooking.reference)}&contact=${encodeURIComponent(submittedBooking.email)}`}
                        variant="secondary"
                      >
                        Manage This Booking
                      </Button>
                      <Button
                        href={buildWhatsAppLink(latestWhatsAppMessage, whatsappNumber)}
                        target="_blank"
                        variant="outline"
                      >
                        Open WhatsApp Again
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : null}

              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setSubmitError(null);
                  setSubmitting(true);
                  try {
                    const payload = {
                      fullName,
                      email,
                      pickupLocation,
                      dropoffLocation,
                      pickupDate,
                      returnDate,
                      pickupTime,
                      vehicleCategory: selectedVehicle?.category ?? vehicleCategory,
                      serviceType,
                      selectedVehicleId: selectedVehicleId || undefined,
                      promoCode: promoCode.trim() || undefined,
                      airportTransfer,
                      notes: notes.trim() || undefined,
                    };
                    let resultRef: string;
                    if (initialReference) {
                      const res = await updatePublicBooking({
                        ...payload,
                        reference: initialReference,
                      });
                      resultRef = res.reference;
                    } else {
                      const res = await submitPublicBooking(payload);
                      resultRef = res.reference;
                    }
                    setSubmittedBooking({
                      reference: resultRef,
                      fullName,
                      email,
                      pickupLocation,
                      dropoffLocation,
                      pickupDate,
                      returnDate,
                      pickupTime,
                      vehicleCategory: selectedVehicle?.category ?? vehicleCategory,
                      selectedVehicleId,
                      serviceType,
                      promoCode,
                      airportTransfer,
                      notes,
                    });
                    const msg = [
                      `Hello Peter Car Rental, I would like to ${bookingIntent} a vehicle request.`,
                      `Reference: ${resultRef}`,
                      `Name: ${fullName || "Not provided"}`,
                      `Email: ${email || "Not provided"}`,
                      `Pickup location: ${pickupLocation}`,
                      `Drop-off location: ${dropoffLocation}`,
                      `Pickup date: ${pickupDate}`,
                      `Return date: ${returnDate}`,
                      `Pickup time: ${pickupTime}`,
                      `Specific vehicle: ${selectedVehicle?.name || "Any available vehicle"}`,
                      `Vehicle category: ${selectedVehicle?.category ?? vehicleCategory}`,
                      `Service type: ${serviceType}`,
                      `Promo code: ${promoCode || "None"}`,
                      `Airport transfer: ${airportTransfer ? "Yes" : "No"}`,
                      `Notes: ${notes || "None"}`,
                    ].join("\n");
                    openWhatsApp(msg, whatsappNumber);
                  } catch (err) {
                    setSubmitError(err instanceof Error ? err.message : "Failed to save booking. Try WhatsApp directly.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Full name</span>
                  <input
                    className={inputClassName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                    type="text"
                    value={fullName}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    className={inputClassName}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </label>

                <Select
                  label="Pickup Location"
                  onChange={(e) => setPickupLocation(e.target.value)}
                  options={bookingLocations.map((o) => ({ label: o, value: o }))}
                  value={pickupLocation}
                />
                <Select
                  label="Drop-off Location"
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  options={bookingLocations.map((o) => ({ label: o, value: o }))}
                  value={dropoffLocation}
                />

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Pickup Date</span>
                  <input
                    className={inputClassName}
                    min={format(today, "yyyy-MM-dd")}
                    onChange={(e) => setPickupDate(e.target.value)}
                    type="date"
                    value={pickupDate}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Return Date</span>
                  <input
                    className={inputClassName}
                    min={pickupDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    type="date"
                    value={returnDate}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Pickup Time</span>
                  <input
                    className={inputClassName}
                    onChange={(e) => setPickupTime(e.target.value)}
                    type="time"
                    value={pickupTime}
                  />
                </label>

                <Select
                  hint="Choose a specific car if you already know the exact vehicle you want."
                  label="Specific Vehicle"
                  onChange={(e) => {
                    const nextId = e.target.value;
                    const next = vehicles.find((v) => v.id === nextId);
                    setSelectedVehicleId(nextId);
                    if (next) setVehicleCategory(next.category);
                  }}
                  options={[
                    { label: "Any available vehicle", value: "" },
                    ...vehicles.map((v) => ({ label: `${v.name} (${v.category})`, value: v.id })),
                  ]}
                  value={selectedVehicleId}
                />

                <Select
                  disabled={Boolean(selectedVehicle)}
                  hint={
                    selectedVehicle
                      ? "Category is locked to match the selected vehicle."
                      : "Choose a category if you are still comparing options."
                  }
                  label="Vehicle Category"
                  onChange={(e) => setVehicleCategory(e.target.value)}
                  options={["Any Category", ...vehicleCategories].map((o) => ({ label: o, value: o }))}
                  value={vehicleCategory}
                />

                <Select
                  label="Service Type"
                  onChange={(e) => setServiceType(e.target.value)}
                  options={serviceTypes.map((o) => ({ label: o, value: o }))}
                  value={serviceType}
                />

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Promo Code</span>
                  <input
                    className={inputClassName}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Apply a promo code if you have one"
                    type="text"
                    value={promoCode}
                  />
                </label>

                {selectedVehicle ? (
                  <div className="rounded-2xl border border-orange-100 bg-orange-50 px-4 py-4 sm:col-span-2">
                    <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                      Selected vehicle
                    </p>
                    <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{selectedVehicle.name}</h3>
                        <p className="text-sm text-slate-600">
                          {selectedVehicle.category} · {selectedVehicle.transmission} · {selectedVehicle.seats} seats
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-orange-600">${selectedVehicle.pricePerDay}/day</p>
                    </div>
                  </div>
                ) : null}

                <label className="inline-flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700 sm:col-span-2 sm:items-center">
                  <input
                    checked={airportTransfer}
                    className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                    onChange={(e) => setAirportTransfer(e.target.checked)}
                    type="checkbox"
                  />
                  <span>Airport pickup or drop-off needed</span>
                </label>

                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Additional Notes</span>
                  <textarea
                    className={textareaClassName}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Share passenger count, luggage needs, destination details, or special requests."
                    value={notes}
                  />
                </label>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                  <Button disabled={submitting} size="lg" type="submit">
                    {submitting ? "Saving…" : initialReference ? "Update Booking Request" : "Send Booking Request"}
                  </Button>
                  <Button size="lg" to="/fleet" variant="outline">
                    Browse Fleet
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            {reasons.map(({ title, description, icon: Icon }) => (
              <Card className="p-5 sm:p-6" key={title}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}