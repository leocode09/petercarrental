import CTA from "../components/home/CTA";
import WhyChoose from "../components/home/WhyChoose";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";

const stats = [
  { value: "1,000+", label: "successful rentals supported" },
  { value: "24/7", label: "customer support coverage" },
  { value: "6+", label: "core fleet categories" },
];

export default function About() {
  return (
    <>
      <Seo canonicalPath="/about" title="About Us | Peter Car Rental" />
      <PageHero
        description="We help travelers, businesses, and organizations move across Rwanda with confidence through premium vehicles and responsive support."
        eyebrow="About Us"
        image="https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1600&q=80"
        title="Premium mobility, local knowledge, personal service"
      />

      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                Built for the way people actually travel in Rwanda
              </h2>
              <p className="text-base leading-7 text-slate-600">
                Peter Car Rental was created to offer something better than basic transport: clear
                communication, reliable vehicles, flexible delivery, and practical guidance based on
                real local experience.
              </p>
              <p className="text-base leading-7 text-slate-600">
                Whether you need a polished city transfer, a corporate fleet partner, or a safari
                4x4 prepared for long scenic routes, our team focuses on making the process smooth
                from the first message to the final handoff.
              </p>
            </div>
          </Card>

          <div className="grid gap-6">
            {stats.map((stat) => (
              <Card className="p-6" key={stat.label}>
                <div className="space-y-2">
                  <p className="text-4xl font-black tracking-[-0.04em] text-slate-950">
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <WhyChoose />
      <CTA />
    </>
  );
}
