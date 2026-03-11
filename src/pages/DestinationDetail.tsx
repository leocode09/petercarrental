import { useMemo } from "react";
import { useParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import VehicleCard from "../components/shared/VehicleCard";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { getDestinationBySlug } from "../data/destinations";
import { getServiceBySlug } from "../data/services";
import { vehicles } from "../data/vehicles";

export default function DestinationDetail() {
  const { slug } = useParams();
  const destination = getDestinationBySlug(slug);

  const bestVehicle = useMemo(
    () => vehicles.find((vehicle) => vehicle.id === destination?.bestVehicleId),
    [destination],
  );
  const linkedService = useMemo(
    () => getServiceBySlug(destination?.serviceSlug),
    [destination?.serviceSlug],
  );

  if (!destination) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <Card className="p-10 text-center">
            <h1 className="text-3xl font-black text-slate-950">Destination not found</h1>
            <div className="mt-6">
              <Button to="/destinations">Back to destinations</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo canonicalPath={destination.route} title={`${destination.name} | Peter Car Rental`} />
      <PageHero
        description={destination.shortDescription}
        eyebrow="Destination Guide"
        image={destination.image}
        title={destination.name}
      >
        <Button to="/booking">Book This Trip</Button>
      </PageHero>

      <section className="section-space">
        <div className="container-shell grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="p-8">
            <div className="space-y-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                {destination.tagline}
              </p>
              <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                Plan this route with confidence
              </h2>
              <p className="text-base leading-7 text-slate-600">{destination.longDescription}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {destination.highlights.map((highlight) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                    key={highlight}
                  >
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="space-y-5">
              <h2 className="text-3xl font-black tracking-[-0.03em] text-slate-950">
                Best fit for this destination
              </h2>
              {linkedService ? (
                <div className="rounded-3xl border border-orange-100 bg-orange-50 p-5">
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                    Recommended service
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-950">{linkedService.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{linkedService.shortDescription}</p>
                  <div className="mt-4">
                    <Button to={linkedService.route} variant="outline">
                      View Service
                    </Button>
                  </div>
                </div>
              ) : null}

              {bestVehicle ? (
                <VehicleCard className="shadow-none" vehicle={bestVehicle} />
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
