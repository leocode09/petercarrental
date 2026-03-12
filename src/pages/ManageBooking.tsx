import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { getVehicleByQueryValue } from "../data/vehicles";
import { buildBookingQueryString, findStoredBooking, type StoredBooking } from "../lib/siteStorage";
import { buildWhatsAppLink, inputClassName, openWhatsApp } from "../lib/utils";

export default function ManageBooking() {
  const [searchParams] = useSearchParams();
  const [reference, setReference] = useState(searchParams.get("reference") ?? "");
  const [contactValue, setContactValue] = useState(searchParams.get("contact") ?? "");
  const [lookupAttempted, setLookupAttempted] = useState(Boolean(searchParams.get("reference") || searchParams.get("contact")));
  const [matchedBooking, setMatchedBooking] = useState<StoredBooking | null>(null);
  const [supportFallbackUsed, setSupportFallbackUsed] = useState(false);

  const supportMessage = useMemo(
    () =>
      [
        "Hello Peter Car Rental, I need help with an existing booking.",
        `Booking reference: ${reference || "Not provided"}`,
        `Email or phone: ${contactValue || "Not provided"}`,
      ].join("\n"),
    [contactValue, reference],
  );
  const matchedVehicle = useMemo(
    () => (matchedBooking ? getVehicleByQueryValue(matchedBooking.selectedVehicleId) : undefined),
    [matchedBooking],
  );

  useEffect(() => {
    if (!reference && !contactValue) {
      setMatchedBooking(null);
      return;
    }

    const storedBooking = findStoredBooking(reference, contactValue);
    setMatchedBooking(storedBooking);
  }, [contactValue, reference]);

  return (
    <>
      <Seo canonicalPath="/manage-booking" title="Manage Booking | Peter Car Rental" />
      <PageHero
        description="Need to adjust pickup details, confirm your schedule, or follow up on an existing reservation?"
        eyebrow="Manage Booking"
        image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
        title="Manage your reservation"
      />

      <section className="section-space">
        <div className="container-shell">
          <Card className="mx-auto max-w-3xl p-5 sm:p-6 md:p-8">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                const storedBooking = findStoredBooking(reference, contactValue);

                setMatchedBooking(storedBooking);
                setLookupAttempted(true);
                setSupportFallbackUsed(!storedBooking);

                if (!storedBooking) {
                  openWhatsApp(supportMessage);
                }
              }}
            >
              <div>
                <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                  Booking support
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use your booking reference or the same email used during the reservation. If we cannot find a local
                  match in this browser, we will open WhatsApp so you can request help directly.
                </p>
              </div>

              <input
                className={inputClassName}
                onChange={(event) => {
                  setReference(event.target.value);
                  setSupportFallbackUsed(false);
                }}
                placeholder="Booking reference"
                required={!contactValue}
                type="text"
                value={reference}
              />
              <input
                className={inputClassName}
                onChange={(event) => {
                  setContactValue(event.target.value);
                  setSupportFallbackUsed(false);
                }}
                placeholder="Email used during booking"
                required={!reference}
                type="text"
                value={contactValue}
              />

              <div className="flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                <Button type="submit">Find Booking</Button>
                <Button href={buildWhatsAppLink(supportMessage)} target="_blank" variant="outline">
                  Contact Support
                </Button>
              </div>
            </form>

            {matchedBooking ? (
              <Card className="mt-6 border border-emerald-100 bg-emerald-50/80 p-5 shadow-none">
                <div className="space-y-4">
                  <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-emerald-600">
                        Local Booking Found
                      </p>
                      <h3 className="mt-2 text-xl font-black text-slate-950">{matchedBooking.reference}</h3>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {matchedBooking.status}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">Traveler</p>
                      <p className="mt-1">{matchedBooking.fullName}</p>
                      <p>{matchedBooking.email}</p>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">Schedule</p>
                      <p className="mt-1">
                        {matchedBooking.pickupDate} at {matchedBooking.pickupTime}
                      </p>
                      <p>Return {matchedBooking.returnDate}</p>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">Trip Details</p>
                      <p className="mt-1">
                        {matchedBooking.pickupLocation} to {matchedBooking.dropoffLocation}
                      </p>
                      <p>{matchedBooking.serviceType}</p>
                    </div>
                    <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">Vehicle</p>
                      <p className="mt-1">
                        {matchedVehicle?.name || "Any available vehicle"}
                      </p>
                      <p>{matchedBooking.vehicleCategory}</p>
                    </div>
                  </div>

                  {matchedBooking.notes ? (
                    <div className="rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm text-slate-700">
                      <p className="font-semibold text-slate-950">Notes</p>
                      <p className="mt-1 leading-6">{matchedBooking.notes}</p>
                    </div>
                  ) : null}

                  <p className="text-xs text-slate-500">
                    Last updated {format(new Date(matchedBooking.updatedAt), "PPP 'at' p")}
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row [&>*]:w-full sm:[&>*]:w-auto">
                    <Button to={`/booking?${buildBookingQueryString(matchedBooking)}`} variant="secondary">
                      Edit Booking Details
                    </Button>
                    <Button
                      href={buildWhatsAppLink(
                        [
                          "Hello Peter Car Rental, I would like to update an existing booking.",
                          `Reference: ${matchedBooking.reference}`,
                          `Customer: ${matchedBooking.fullName}`,
                          `Email: ${matchedBooking.email}`,
                        ].join("\n"),
                      )}
                      target="_blank"
                      variant="outline"
                    >
                      Request Update on WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            ) : null}

            {lookupAttempted && !matchedBooking ? (
              <p className="mt-6 text-sm leading-6 text-slate-600">
                {supportFallbackUsed
                  ? "No saved booking was found in this browser. A WhatsApp draft has been opened so you can continue with support manually."
                  : "No saved booking was found in this browser yet. Use Contact Support if you need help with a reservation created elsewhere."}
              </p>
            ) : null}
          </Card>
        </div>
      </section>
    </>
  );
}
