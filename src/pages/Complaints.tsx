import { useState } from "react";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { usePublicData } from "../components/providers/PublicDataProvider";
import { submitComplaint } from "../lib/firestore-public-mutations";
import { inputClassName, openWhatsApp, textareaClassName } from "../lib/utils";

export default function Complaints() {
  const { data } = usePublicData();
  const whatsappNumber = data?.companyInfo.whatsappNumber ?? "";
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [details, setDetails] = useState("");
  const [bookingReference, setBookingReference] = useState("");
  const [submitting, setSubmitting] = useState(false);

  return (
    <>
      <Seo canonicalPath="/complaints" title="Complaints | Peter Car Rental" />
      <PageHero
        description="If something fell short of expectations, tell us directly so we can follow up quickly and improve the experience."
        eyebrow="Complaints"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        title="Share a service concern"
      />

      <section className="section-space">
        <div className="container-shell">
          <Card className="mx-auto max-w-3xl p-6 md:p-8">
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();
                setSubmitting(true);
                try {
                  await submitComplaint({ name, contactInfo, details, bookingReference: bookingReference || undefined });
                  openWhatsApp(
                    [
                      "Hello Peter Car Rental, I want to report a complaint.",
                      `Name: ${name}`,
                      `Contact: ${contactInfo}`,
                      ...(bookingReference ? [`Booking ref: ${bookingReference}`] : []),
                      `Complaint details: ${details}`,
                    ].join("\n"),
                    whatsappNumber,
                  );
                } catch {
                  openWhatsApp(
                    `Hello Peter Car Rental, complaint. Name: ${name}, Contact: ${contactInfo}${bookingReference ? `, Ref: ${bookingReference}` : ""}, Details: ${details}`,
                    whatsappNumber,
                  );
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              <div>
                <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                  Tell us what happened
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  We review every complaint carefully and aim to respond with clarity and action.
                </p>
              </div>

              <input
                className={inputClassName}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
                type="text"
                value={name}
              />
              <input
                className={inputClassName}
                onChange={(event) => setContactInfo(event.target.value)}
                placeholder="Email or phone"
                required
                type="text"
                value={contactInfo}
              />
              <input
                className={inputClassName}
                onChange={(event) => setBookingReference(event.target.value)}
                placeholder="Booking reference (optional)"
                type="text"
                value={bookingReference}
              />
              <textarea
                className={textareaClassName}
                onChange={(event) => setDetails(event.target.value)}
                placeholder="Describe the issue in detail."
                required
                value={details}
              />
              <Button disabled={submitting} type="submit">
                {submitting ? "Submitting…" : "Submit Complaint"}
              </Button>
            </form>
          </Card>
        </div>
      </section>
    </>
  );
}
