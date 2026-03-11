import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { bookingLocations, serviceTypes } from "../../data/site";
import { vehicleCategories } from "../../data/vehicles";
import { inputClassName } from "../../lib/utils";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

const today = new Date();

export default function BookingWidget() {
  const navigate = useNavigate();
  const [pickupLocation, setPickupLocation] = useState("Kigali Airport");
  const [dropoffLocation, setDropoffLocation] = useState("Same as pickup");
  const [pickupDate, setPickupDate] = useState(format(addDays(today, 1), "yyyy-MM-dd"));
  const [returnDate, setReturnDate] = useState(format(addDays(today, 4), "yyyy-MM-dd"));
  const [pickupTime, setPickupTime] = useState("09:00");
  const [vehicleCategory, setVehicleCategory] = useState("Any Category");
  const [serviceType, setServiceType] = useState("Self-Drive");
  const [promoCode, setPromoCode] = useState("");
  const [airportTransfer, setAirportTransfer] = useState(true);

  const locationOptions = useMemo(
    () => bookingLocations.map((option) => ({ label: option, value: option })),
    [],
  );

  const categoryOptions = useMemo(
    () =>
      ["Any Category", ...vehicleCategories].map((option) => ({
        label: option,
        value: option,
      })),
    [],
  );

  const serviceOptions = useMemo(
    () => serviceTypes.map((option) => ({ label: option, value: option })),
    [],
  );

  return (
    <section className="relative z-20 -mt-16 pb-10">
      <div className="container-shell">
        <Card className="rounded-[32px] p-6 md:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Booking Widget
            </p>
            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 md:text-3xl">
              Find Your Perfect Ride
            </h2>
          </div>

          <form
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();

              const params = new URLSearchParams({
                pickupLocation,
                dropoffLocation,
                pickupDate,
                returnDate,
                pickupTime,
                category: vehicleCategory,
                serviceType,
              });

              if (promoCode.trim()) {
                params.set("promoCode", promoCode.trim());
              }

              if (airportTransfer) {
                params.set("airport", "true");
              }

              navigate(`/booking?${params.toString()}`);
            }}
          >
            <Select
              label="Pickup Location"
              onChange={(event) => setPickupLocation(event.target.value)}
              options={locationOptions}
              value={pickupLocation}
            />
            <Select
              label="Drop-off Location"
              onChange={(event) => setDropoffLocation(event.target.value)}
              options={locationOptions}
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
              options={categoryOptions}
              value={vehicleCategory}
            />

            <Select
              label="Service Type"
              onChange={(event) => setServiceType(event.target.value)}
              options={serviceOptions}
              value={serviceType}
            />

            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Promo Code</span>
              <input
                className={inputClassName}
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Enter code"
                type="text"
                value={promoCode}
              />
            </label>

            <div className="md:col-span-2 xl:col-span-4 flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
              <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
                <input
                  checked={airportTransfer}
                  className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  onChange={(event) => setAirportTransfer(event.target.checked)}
                  type="checkbox"
                />
                <span>Airport pickup/drop-off</span>
              </label>

              <Button size="lg" type="submit">
                Check Availability
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
