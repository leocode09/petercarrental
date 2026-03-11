import TestimonialsSection from "../components/home/Testimonials";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";

const stats = [
  { value: "5.0/5", label: "service impression" },
  { value: "4", label: "featured customer stories" },
  { value: "24/7", label: "support promise" },
];

export default function Reviews() {
  return (
    <>
      <Seo canonicalPath="/reviews" title="Reviews | Peter Car Rental" />
      <PageHero
        description="Client feedback from safari trips, corporate assignments, airport transfers, and long-term rentals."
        eyebrow="Reviews"
        image="https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1600&q=80"
        title="What clients say about our service"
      />

      <section className="py-16">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card className="p-6 text-center" key={stat.label}>
              <p className="text-4xl font-black tracking-[-0.04em] text-slate-950">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-slate-600">{stat.label}</p>
            </Card>
          ))}
        </div>
      </section>

      <TestimonialsSection />
    </>
  );
}
