import { useState } from "react";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { inputClassName, openWhatsApp } from "../lib/utils";

export default function ManageBooking() {
  const [reference, setReference] = useState("");
  const [contactValue, setContactValue] = useState("");

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
          <Card className="mx-auto max-w-3xl p-6 md:p-8">
            <form
              className="space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                openWhatsApp(
                  [
                    "Hello Peter Car Rental, I need help with an existing booking.",
                    `Booking reference: ${reference}`,
                    `Email or phone: ${contactValue}`,
                  ].join("\n"),
                );
              }}
            >
              <div>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                  Booking support
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Send us your booking reference and the contact detail used during the reservation.
                </p>
              </div>

              <input
                className={inputClassName}
                onChange={(event) => setReference(event.target.value)}
                placeholder="Booking reference"
                required
                type="text"
                value={reference}
              />
              <input
                className={inputClassName}
                onChange={(event) => setContactValue(event.target.value)}
                placeholder="Email or phone number"
                required
                type="text"
                value={contactValue}
              />
              <Button type="submit">Request Update</Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
