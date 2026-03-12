import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../../data/services";
import ServiceIcon from "../shared/ServiceIcon";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function ServicesSection() {
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Services
            </p>
            <h2 className="page-section-title text-slate-950">Our Services</h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              From premium city transfers to safari-ready 4x4 rentals, we tailor every ride to
              your itinerary, group size, and travel style.
            </p>
          </div>
          <Button className="w-full sm:w-auto" to="/services" variant="outline">
            Explore All Services
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Link className="block h-full" key={service.slug} to={service.route}>
              <Card className="group h-full p-5 transition duration-200 hover:-translate-y-1 hover:border-orange-200 sm:p-7">
                <div className="space-y-5">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <ServiceIcon className="h-6 w-6" iconKey={service.iconKey} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-950">{service.name}</h3>
                    <p className="text-sm leading-6 text-slate-600">{service.shortDescription}</p>
                  </div>

                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                    <span>Learn more</span>
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
