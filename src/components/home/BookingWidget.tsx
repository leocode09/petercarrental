import { addDays, format } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getVehicleCategories } from "../../lib/firestore-public";
import { usePublicData } from "../providers/PublicDataProvider";
import { inputClassName } from "../../lib/utils";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Select from "../ui/Select";

const today = new Date();

export default function BookingWidget() {
  const { data } = usePublicData();
  const navigate = useNavigate();
  const bookingLocations = data?.bookingLocations ?? [];
  const serviceTypes = data?.serviceTypes ?? [];
  const vehicleCategories = data ? getVehicleCategories(data.vehicles) : [];
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
    [bookingLocations],
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
    [serviceTypes],
  );

  return (
    <section className="relative z-20 -mt-12 pb-8 sm:-mt-16 sm:pb-10">
      <div className="container-shell">
        <Card className="rounded-[28px] p-5 sm:p-6 md:rounded-[32px] md:p-8">
          <div className="mb-5 space-y-2 sm:mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Booking Widget
            </p>
            <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl md:text-3xl">
              Find Your Perfect Ride
            </h2>
          </div>

          <form
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
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

            <div className="flex flex-col gap-4 pt-2 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between xl:col-span-4">
              <label className="inline-flex items-start gap-3 text-sm font-medium text-slate-700 sm:items-center">
                <input
                  checked={airportTransfer}
                  className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                  onChange={(event) => setAirportTransfer(event.target.checked)}
                  type="checkbox"
                />
                <span>Airport pickup/drop-off</span>
              </label>

              <Button className="w-full sm:w-auto" size="lg" type="submit">
                Check Availability
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  );
}
