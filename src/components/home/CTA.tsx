import { Phone } from "lucide-react";
import { companyInfo } from "../../data/site";
import Button from "../ui/Button";

export default function CTA() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[36px] bg-slate-950 px-6 py-12 text-white shadow-2xl shadow-slate-950/20 md:px-10 lg:px-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                Ready to Hit the Road?
              </p>
              <h2 className="page-section-title text-white">Ready to Hit the Road?</h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
                Book your vehicle today and experience Rwanda like never before. Fast, easy, and
                reliable.
              </p>
              <p className="max-w-2xl text-sm leading-7 text-slate-400">{companyInfo.shortDescription}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Button size="lg" to="/booking">
                Book Your Ride
              </Button>
              <Button href={companyInfo.whatsappShareHref} size="lg" target="_blank" variant="whatsapp">
                WhatsApp
              </Button>
              <Button href={companyInfo.telHref} size="lg" variant="light">
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
