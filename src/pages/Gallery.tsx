import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import { companyInfo } from "../data/site";
import { destinations } from "../data/destinations";
import { vehicles } from "../data/vehicles";

const galleryImages = [
  companyInfo.heroImage,
  ...vehicles.map((vehicle) => vehicle.image),
  ...destinations.map((destination) => destination.image),
];

export default function Gallery() {
  return (
    <>
      <Seo canonicalPath="/gallery" title="Gallery | Peter Car Rental" />
      <PageHero
        description="A visual look at our fleet, the destinations we serve, and the style of travel we help create across Rwanda."
        eyebrow="Gallery"
        image={companyInfo.heroImage}
        title="Explore the Peter Car Rental gallery"
      />

      <section className="section-space">
        <div className="container-shell columns-1 gap-6 md:columns-2 xl:columns-3">
          {galleryImages.map((image, index) => (
            <div className="mb-6 overflow-hidden rounded-[28px] shadow-soft" key={`${image}-${index}`}>
              <img alt={`Peter Car Rental gallery ${index + 1}`} className="w-full object-cover" src={image} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
