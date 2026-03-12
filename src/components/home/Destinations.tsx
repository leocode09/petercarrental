import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicData } from "../providers/PublicDataProvider";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function Destinations() {
  const { data } = usePublicData();
  const destinations = data?.destinations ?? [];
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Destinations
            </p>
            <h2 className="page-section-title text-slate-950">Popular Destinations</h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Rent a car and discover Rwanda&apos;s breathtaking landscapes and vibrant culture.
            </p>
          </div>
          <Button className="w-full sm:w-auto" to="/destinations" variant="outline">
            Explore Destinations
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {destinations.map((destination) => (
            <Link
              className="block h-full"
              key={destination.slug ?? destination.id}
              to={destination.route ?? `/destinations/${destination.slug}`}
            >
              <Card className="group h-full overflow-hidden">
                <img
                  alt={destination.name}
                  className="h-52 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-56"
                  loading="lazy"
                  src={destination.image ?? ""}
                />
                <div className="space-y-3 p-5 sm:p-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-950">{destination.name}</h3>
                    <p className="text-sm font-semibold text-orange-600">{destination.tagline}</p>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {destination.shortDescription ?? destination.description ?? ""}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600">
                    <span>Plan this trip</span>
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
