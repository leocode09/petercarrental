import DestinationsSection from "../components/home/Destinations";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";

const travelTips = [
  "Plan early departures for park drives and mountain routes.",
  "Choose a 4x4 for safari parks and rural terrain-heavy itineraries.",
  "Airport delivery helps you start your trip without Kigali delays.",
];

export default function Destinations() {
  return (
    <>
      <Seo canonicalPath="/destinations" title="Destinations | Peter Car Rental" />
      <PageHero
        description="Explore Kigali, Akagera, Volcanoes, Nyungwe, and more with a vehicle tailored to Rwanda's roads and your itinerary."
        eyebrow="Destinations"
        image="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
        title="Popular Rwanda destinations"
      />
      <DestinationsSection />

      <section className="pb-20">
        <div className="container-shell grid gap-6 md:grid-cols-3">
          {travelTips.map((tip) => (
            <Card className="p-6" key={tip}>
              <p className="text-sm font-semibold leading-6 text-slate-700">{tip}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
