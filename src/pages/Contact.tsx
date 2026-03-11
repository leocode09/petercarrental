import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { companyInfo } from "../data/site";
import { inputClassName, openWhatsApp, textareaClassName } from "../lib/utils";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <>
      <Seo canonicalPath="/contact" title="Contact | Peter Car Rental" />
      <PageHero
        description="Need help choosing a vehicle, confirming availability, or planning a route? Contact our team directly."
        eyebrow="Contact"
        image="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
        title="Let&apos;s plan your next ride"
      />

      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-6">
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Office Location</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{companyInfo.locationFull}</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Phone</h2>
                  <a className="mt-2 block text-sm leading-6 text-slate-600 hover:text-orange-600" href={companyInfo.telHref}>
                    {companyInfo.phoneDisplay}
                  </a>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-950">Email</h2>
                  <a className="mt-2 block text-sm leading-6 text-slate-600 hover:text-orange-600" href={companyInfo.mailtoHref}>
                    {companyInfo.email}
                  </a>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Message Us
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-slate-950">
                  Send a direct inquiry
                </h2>
              </div>

              <form
                className="space-y-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  openWhatsApp(
                    [
                      "Hello Peter Car Rental, I have an inquiry.",
                      `Name: ${name}`,
                      `Email: ${email}`,
                      `Message: ${message}`,
                    ].join("\n"),
                  );
                }}
              >
                <input
                  className={inputClassName}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your full name"
                  required
                  type="text"
                  value={name}
                />
                <input
                  className={inputClassName}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  required
                  type="email"
                  value={email}
                />
                <textarea
                  className={textareaClassName}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us about your trip or the support you need."
                  required
                  value={message}
                />
                <div className="flex flex-wrap gap-3">
                  <Button type="submit">Send via WhatsApp</Button>
                  <Button href={companyInfo.mailtoHref} variant="outline">
                    Send Email
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
