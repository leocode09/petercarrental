import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import VehicleCard from "../components/shared/VehicleCard";
import Select from "../components/ui/Select";
import { getVehicleCategories } from "../lib/firestore-public";
import { usePublicData } from "../components/providers/PublicDataProvider";

export default function Fleet() {
  const { data } = usePublicData();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "All";
  const selectedService = searchParams.get("serviceType") ?? "All";

  const vehicles = data?.vehicles ?? [];
  const vehicleCategories = data ? getVehicleCategories(data.vehicles) : [];
  const serviceTypes = data?.serviceTypes ?? [];
  const whatsappNumber = data?.companyInfo.whatsappNumber ?? "";

  const filteredVehicles = useMemo(
    () =>
      vehicles.filter((vehicle) => {
        const matchesCategory =
          selectedCategory === "All" ||
          selectedCategory === "Any Category" ||
          vehicle.category === selectedCategory;

        const matchesService =
          selectedService === "All" ||
          (selectedService === "Self-Drive" && vehicle.category !== "Luxury") ||
          (selectedService === "With Chauffeur" && vehicle.category !== "4x4 Safari");

        return matchesCategory && matchesService;
      }),
    [vehicles, selectedCategory, selectedService],
  );

  return (
    <>
      <Seo canonicalPath="/fleet" title="Our Fleet | Peter Car Rental" />
      <PageHero
        description="Browse our premium fleet for city travel, executive transfers, national park adventures, and group transport across Rwanda."
        eyebrow="Our Fleet"
        image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80"
        title="Choose the right vehicle for every Rwanda journey"
      />

      <section className="section-space">
        <div className="container-shell space-y-8">
          <div className="surface-card rounded-[28px] p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Filter by category"
                onChange={(event) => {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("category", event.target.value);
                  setSearchParams(nextParams);
                }}
                options={[
                  { label: "All Categories", value: "All" },
                  ...vehicleCategories.map((category) => ({ label: category, value: category })),
                ]}
                value={selectedCategory}
              />

              <Select
                label="Filter by service type"
                onChange={(event) => {
                  const nextParams = new URLSearchParams(searchParams);
                  nextParams.set("serviceType", event.target.value);
                  setSearchParams(nextParams);
                }}
                options={[
                  { label: "All Services", value: "All" },
                  ...serviceTypes.map((service) => ({ label: service, value: service })),
                ]}
                value={selectedService}
              />
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950 sm:text-3xl">
                Available vehicles
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                {filteredVehicles.length} vehicle{filteredVehicles.length === 1 ? "" : "s"} ready
                to book.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredVehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                whatsappNumber={whatsappNumber}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
