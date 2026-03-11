import { ArrowRight } from "lucide-react";
import { featuredVehicles } from "../../data/vehicles";
import VehicleCard from "../shared/VehicleCard";
import Button from "../ui/Button";

export default function FeaturedVehicles() {
  return (
    <section className="section-space">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Featured Vehicles
            </p>
            <h2 className="page-section-title text-slate-950">Featured Vehicles</h2>
            <p className="text-base leading-7 text-slate-600 md:text-lg">
              Hand-picked vehicles for every journey - from city commutes to wild safari
              adventures across Rwanda.
            </p>
          </div>
          <Button to="/fleet" variant="outline">
            View All Vehicles <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      </div>
    </section>
  );
}
