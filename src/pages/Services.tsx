import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import ServiceIcon from "../components/shared/ServiceIcon";
import Card from "../components/ui/Card";
import { services } from "../data/services";

export default function Services() {
  return (
    <>
      <Seo canonicalPath="/services" title="Services | Peter Car Rental" />
      <PageHero
        description="Self-drive rentals, chauffeur-driven travel, airport transfers, corporate mobility, safari 4x4s, and flexible long-stay packages."
        eyebrow="Services"
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        title="Transport services built around your itinerary"
      />

      <section className="section-space">
        <div className="container-shell">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <Link className="block h-full" key={service.slug} to={service.route}>
                <Card className="group h-full p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-200 sm:p-7">
                  <div className="space-y-5">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                      <ServiceIcon className="h-6 w-6" iconKey={service.iconKey} />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
                        {service.name}
                      </h2>
                      <p className="text-sm leading-6 text-slate-600">{service.teaser}</p>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-600">
                      {service.inclusions.slice(0, 3).map((item) => (
                        <li key={item}>- {item}</li>
                      ))}
                    </ul>

                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                      <span>View service details</span>
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
