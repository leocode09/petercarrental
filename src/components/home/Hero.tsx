import { ShieldCheck, Star, TimerReset } from "lucide-react";
import { companyInfo } from "../../data/site";
import Button from "../ui/Button";

const highlights = [
  { label: "Fully Insured", icon: ShieldCheck },
  { label: "24/7 Support", icon: TimerReset },
  { label: "5-Star Rated", icon: Star },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2, 6, 23, 0.86), rgba(2, 6, 23, 0.42)), url(${companyInfo.heroImage})`,
        }}
      />
      <div className="container-shell relative z-10 grid min-h-[720px] items-center gap-12 py-20 lg:grid-cols-[1.2fr_0.8fr] lg:py-28">
        <div className="max-w-3xl space-y-8">
          <span className="eyebrow">Rwanda&apos;s Premier Car Rental</span>
          <div className="space-y-5">
            <h1 className="text-5xl font-black tracking-[-0.04em] text-white md:text-7xl">
              Drive Rwanda
              <span className="block text-orange-400">with Confidence</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-200 md:text-xl">
              Premium self-drive and chauffeur-driven vehicles for safaris, business, and city
              travel. Trusted by thousands across Rwanda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" to="/booking">
              Book Your Ride
            </Button>
            <Button href={companyInfo.whatsappShareHref} size="lg" target="_blank" variant="light">
              WhatsApp Us
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {highlights.map(({ label, icon: Icon }) => (
              <div
                className="dark-surface inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white"
                key={label}
              >
                <Icon className="h-4 w-4 text-orange-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
