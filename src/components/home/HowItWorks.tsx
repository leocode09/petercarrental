import { CalendarRange, CarFront, CircleCheckBig, KeyRound } from "lucide-react";
import Card from "../ui/Card";

const steps = [
  {
    title: "Choose Your Car",
    description: "Browse our fleet and find the perfect vehicle for your trip.",
    icon: CarFront,
  },
  {
    title: "Select Dates",
    description: "Pick your rental period and preferred pickup location.",
    icon: CalendarRange,
  },
  {
    title: "Confirm Booking",
    description: "Complete your reservation online or via WhatsApp.",
    icon: CircleCheckBig,
  },
  {
    title: "Hit the Road",
    description: "Pick up your car or get it delivered to your location.",
    icon: KeyRound,
  },
];

export default function HowItWorks() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
            Process
          </p>
          <h2 className="page-section-title text-slate-950">How It Works</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(({ title, description, icon: Icon }, index) => (
            <Card className="h-full p-6" key={title}>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-400">0{index + 1}</span>
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
