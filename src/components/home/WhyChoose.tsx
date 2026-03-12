import { Award, Clock3, MapPinned, Shield } from "lucide-react";
import Card from "../ui/Card";

const features = [
  {
    title: "Trusted Premium Fleet",
    description: "Clean, well-maintained vehicles prepared for business, leisure, and safari travel.",
    icon: Shield,
  },
  {
    title: "Fast, Flexible Delivery",
    description: "Pickup from Kigali Airport, your hotel, the city center, or a custom location.",
    icon: MapPinned,
  },
  {
    title: "Responsive Support",
    description: "Our team stays available before, during, and after your rental for total peace of mind.",
    icon: Clock3,
  },
  {
    title: "Service You Remember",
    description: "Professional coordination, transparent pricing, and care that goes beyond the keys.",
    icon: Award,
  },
];

export default function WhyChoose() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Why Choose Peter Car Rental?
          </p>
          <h2 className="page-section-title text-slate-950">Why Choose Peter Car Rental?</h2>
          <p className="text-base leading-7 text-slate-600 md:text-lg">
            With years of experience serving tourists, business travelers, NGOs, and residents in
            Rwanda, we&apos;ve built a reputation for excellence, reliability, and unmatched customer
            care.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <Card className="h-full p-5 sm:p-6" key={title}>
              <div className="space-y-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
