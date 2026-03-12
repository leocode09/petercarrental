import { addDays, format } from "date-fns";
import { ShieldCheck, TimerReset, WalletCards } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import { bookingLocations, serviceTypes } from "../data/site";
import { getVehicleByQueryValue, vehicleCategories, vehicles } from "../data/vehicles";
import { saveBooking, type StoredBooking } from "../lib/siteStorage";
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

export default function Booking() {
  const [searchParams] = useSearchParams();
  const initialVehicle = getVehicleByQueryValue(searchParams.get("vehicle"));
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
  const [submittedBooking, setSubmittedBooking] = useState<StoredBooking | null>(null);

  const selectedVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === selectedVehicleId),
    [selectedVehicleId],
  );
  const submittedVehicle = useMemo(
    () => (submittedBooking ? vehicles.find((vehicle) => vehicle.id === submittedBooking.selectedVehicleId) : undefined),
    [submittedBooking],
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
                    Reference <span className="font-semibold text-slate-950">{initialReference}</span> is loaded from
                    your browser so you can update the request and resend it quickly.
                  </p>
                ) : null}
              </div>

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
                      Your request is now saved in this browser and the WhatsApp draft has been opened for confirmation.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                      <Button
                        to={`/manage-booking?reference=${encodeURIComponent(submittedBooking.reference)}&contact=${encodeURIComponent(submittedBooking.email)}`}
                        variant="secondary"
                      >
                        Manage This Booking
                      </Button>
                      <Button href={buildWhatsAppLink(latestWhatsAppMessage)} target="_blank" variant="outline">
                        Open WhatsApp Again
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : null}

              <form
                className="grid gap-4 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  const savedBooking = saveBooking({
                    reference: initialReference || undefined,
                    fullName,
                    email,
                    pickupLocation,
                    dropoffLocation,
                    pickupDate,
                    returnDate,
                    pickupTime,
                    vehicleCategory: selectedVehicle?.category ?? vehicleCategory,
                    serviceType,
                    selectedVehicleId,
                    promoCode,
                    airportTransfer,
                    notes,
                  });

                  const whatsappMessage = [
                    `Hello Peter Car Rental, I would like to ${bookingIntent} a vehicle request.`,
                    `Reference: ${savedBooking.reference}`,
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

                  setSubmittedBooking(savedBooking);
                  openWhatsApp(whatsappMessage);
                }}
              >
                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Full name</span>
                  <input
                    className={inputClassName}
                    onChange={(event) => setFullName(event.target.value)}
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
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </label>

                <Select
                  label="Pickup Location"
                  onChange={(event) => setPickupLocation(event.target.value)}
                  options={bookingLocations.map((option) => ({ label: option, value: option }))}
                  value={pickupLocation}
                />
                <Select
                  label="Drop-off Location"
                  onChange={(event) => setDropoffLocation(event.target.value)}
                  options={bookingLocations.map((option) => ({ label: option, value: option }))}
                  value={dropoffLocation}
                />

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Pickup Date</span>
                  <input
                    className={inputClassName}
                    min={format(today, "yyyy-MM-dd")}
                    onChange={(event) => setPickupDate(event.target.value)}
                    type="date"
                    value={pickupDate}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Return Date</span>
                  <input
                    className={inputClassName}
                    min={pickupDate}
                    onChange={(event) => setReturnDate(event.target.value)}
                    type="date"
                    value={returnDate}
                  />
                </label>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Pickup Time</span>
                  <input
                    className={inputClassName}
                    onChange={(event) => setPickupTime(event.target.value)}
                    type="time"
                    value={pickupTime}
                  />
                </label>

                <Select
                  hint="Choose a specific car if you already know the exact vehicle you want."
                  label="Specific Vehicle"
                  onChange={(event) => {
                    const nextVehicleId = event.target.value;
                    const nextVehicle = vehicles.find((vehicle) => vehicle.id === nextVehicleId);

                    setSelectedVehicleId(nextVehicleId);

                    if (nextVehicle) {
                      setVehicleCategory(nextVehicle.category);
                    }
                  }}
                  options={[
                    { label: "Any available vehicle", value: "" },
                    ...vehicles.map((vehicle) => ({
                      label: `${vehicle.name} (${vehicle.category})`,
                      value: vehicle.id,
                    })),
                  ]}
                  value={selectedVehicleId}
                />

                <Select
                  disabled={Boolean(selectedVehicle)}
                  label="Vehicle Category"
                  onChange={(event) => setVehicleCategory(event.target.value)}
                  options={["Any Category", ...vehicleCategories].map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  hint={
                    selectedVehicle
                      ? "Category is locked to match the selected vehicle."
                      : "Choose a category if you are still comparing options."
                  }
                  value={vehicleCategory}
                />

                <Select
                  label="Service Type"
                  onChange={(event) => setServiceType(event.target.value)}
                  options={serviceTypes.map((option) => ({ label: option, value: option }))}
                  value={serviceType}
                />

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Promo Code</span>
                  <input
                    className={inputClassName}
                    onChange={(event) => setPromoCode(event.target.value)}
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
                    onChange={(event) => setAirportTransfer(event.target.checked)}
                    type="checkbox"
                  />
                  <span>Airport pickup or drop-off needed</span>
                </label>

                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Additional Notes</span>
                  <textarea
                    className={textareaClassName}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Share passenger count, luggage needs, destination details, or special requests."
                    value={notes}
                  />
                </label>

                <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                  <Button size="lg" type="submit">
                    {initialReference ? "Update Booking Request" : "Send Booking Request"}
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
