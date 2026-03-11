import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import ServiceIcon from "../components/shared/ServiceIcon";
import VehicleCard from "../components/shared/VehicleCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { companyInfo } from "../data/site";
import { getServiceBySlug } from "../data/services";
import { vehicles } from "../data/vehicles";
import { buildWhatsAppLink } from "../lib/utils";

export default function ServiceDetail() {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);

  const recommendedVehicles = useMemo(() => {
    if (!service) return [];
    return vehicles.filter((vehicle) => service.recommendedVehicleIds.includes(vehicle.id));
  }, [service]);
  const bookingLink = useMemo(() => {
    if (!service) return "/booking";

    const params = new URLSearchParams();

    if (service.slug === "self-drive") {
      params.set("serviceType", "Self-Drive");
    }

    if (service.slug === "chauffeur" || service.slug === "airport-transfers" || service.slug === "wedding-events") {
      params.set("serviceType", "With Chauffeur");
    }

    if (service.slug === "airport-transfers") {
      params.set("pickupLocation", "Kigali Airport");
      params.set("airport", "true");
      params.set("notes", "Interested in airport pickup or drop-off support.");
    }

    if (service.slug === "safari") {
      params.set("category", "4x4 Safari");
    }

    if (service.slug === "corporate") {
      params.set("notes", "Interested in corporate or NGO transport support.");
    }

    if (service.slug === "long-term") {
      params.set("notes", "Interested in a long-term rental package.");
    }

    if (service.slug === "wedding-events") {
      params.set("notes", "Interested in wedding or event transport.");
    }

    const search = params.toString();

    return search ? `/booking?${search}` : "/booking";
  }, [service]);
  const serviceWhatsAppLink = useMemo(() => {
    if (!service) {
      return companyInfo.whatsappShareHref;
    }

    return buildWhatsAppLink(
      `Hello Peter Car Rental, I would like to learn more about the ${service.name} service.`,
    );
  }, [service]);

  if (!service) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <Card className="p-10 text-center">
            <h1 className="text-3xl font-black text-slate-950">Service not found</h1>
            <p className="mt-3 text-slate-600">The service you requested is not available.</p>
            <div className="mt-6">
              <Button to="/services">Back to services</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo canonicalPath={service.route} title={`${service.name} | Peter Car Rental`} />
      <PageHero
        description={service.teaser}
        eyebrow="Service Detail"
        image={service.heroImage}
        title={service.name}
      >
        <Button href={serviceWhatsAppLink} target="_blank" variant="whatsapp">
          Inquire on WhatsApp
        </Button>
        <Button to={bookingLink} variant="light">
          Book Now
        </Button>
      </PageHero>

      <section className="section-space">
        <div className="container-shell space-y-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <Card className="p-8">
              <div className="space-y-5">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                  <ServiceIcon className="h-6 w-6" iconKey={service.iconKey} />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                    Key Benefits
                  </h2>
                  <p className="text-base leading-7 text-slate-600">{service.longDescription}</p>
                </div>
                <ul className="grid gap-3 md:grid-cols-2">
                  {service.inclusions.map((item) => (
                    <li
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      key={item}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">Ideal For</h2>
                <p className="text-base leading-7 text-slate-600">
                  This service works especially well for the following travel styles and trip
                  scenarios.
                </p>
                <div className="space-y-3">
                  {service.idealFor.map((item) => (
                    <div
                      className="rounded-2xl border border-slate-200 px-4 py-4 text-sm font-medium text-slate-700"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                Recommended Fleet
              </p>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                Recommended vehicles for this service
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {recommendedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
