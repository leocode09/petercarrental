import { addDays, format } from "date-fns";
import { ShieldCheck, TimerReset, WalletCards } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import { bookingLocations, serviceTypes } from "../data/site";
import { vehicleCategories } from "../data/vehicles";
import { inputClassName, openWhatsApp, textareaClassName } from "../lib/utils";

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
  const [pickupLocation, setPickupLocation] = useState(searchParams.get("pickupLocation") ?? "Kigali Airport");
  const [dropoffLocation, setDropoffLocation] = useState(searchParams.get("dropoffLocation") ?? "Same as pickup");
  const [pickupDate, setPickupDate] = useState(searchParams.get("pickupDate") ?? format(addDays(today, 1), "yyyy-MM-dd"));
  const [returnDate, setReturnDate] = useState(searchParams.get("returnDate") ?? format(addDays(today, 4), "yyyy-MM-dd"));
  const [pickupTime, setPickupTime] = useState(searchParams.get("pickupTime") ?? "09:00");
  const [vehicleCategory, setVehicleCategory] = useState(searchParams.get("category") ?? "Any Category");
  const [serviceType, setServiceType] = useState(searchParams.get("serviceType") ?? "Self-Drive");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

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
        <div className="container-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Booking Request
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  Tell us about your trip
                </h2>
              </div>

              <form
                className="grid gap-4 md:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  openWhatsApp(
                    [
                      "Hello Peter Car Rental, I would like to book a vehicle.",
                      `Name: ${fullName || "Not provided"}`,
                      `Email: ${email || "Not provided"}`,
                      `Pickup location: ${pickupLocation}`,
                      `Drop-off location: ${dropoffLocation}`,
                      `Pickup date: ${pickupDate}`,
                      `Return date: ${returnDate}`,
                      `Pickup time: ${pickupTime}`,
                      `Vehicle category: ${vehicleCategory}`,
                      `Service type: ${serviceType}`,
                      `Notes: ${notes || "None"}`,
                    ].join("\n"),
                  );
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
                  label="Vehicle Category"
                  onChange={(event) => setVehicleCategory(event.target.value)}
                  options={["Any Category", ...vehicleCategories].map((option) => ({
                    label: option,
                    value: option,
                  }))}
                  value={vehicleCategory}
                />

                <Select
                  label="Service Type"
                  onChange={(event) => setServiceType(event.target.value)}
                  options={serviceTypes.map((option) => ({ label: option, value: option }))}
                  value={serviceType}
                />

                <label className="md:col-span-2 flex flex-col gap-2">
                  <span className="text-sm font-semibold text-slate-700">Additional Notes</span>
                  <textarea
                    className={textareaClassName}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="Share passenger count, luggage needs, destination details, or special requests."
                    value={notes}
                  />
                </label>

                <div className="md:col-span-2 flex flex-wrap gap-3">
                  <Button size="lg" type="submit">
                    Send Booking Request
                  </Button>
                  <Button href="/fleet" size="lg" variant="outline">
                    Browse Fleet
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          <div className="space-y-6">
            {reasons.map(({ title, description, icon: Icon }) => (
              <Card className="p-6" key={title}>
                <div className="flex gap-4">
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
