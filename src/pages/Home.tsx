import BookingWidget from "../components/home/BookingWidget";
import BlogPreview from "../components/home/BlogPreview";
import CTA from "../components/home/CTA";
import Destinations from "../components/home/Destinations";
import FeaturedVehicles from "../components/home/FeaturedVehicles";
import Hero from "../components/home/Hero";
import HowItWorks from "../components/home/HowItWorks";
import ServicesSection from "../components/home/ServicesSection";
import Testimonials from "../components/home/Testimonials";
import WhyChoose from "../components/home/WhyChoose";
import Seo from "../components/seo/Seo";

export default function Home() {
  return (
    <>
      <Seo />
      <Hero />
      <BookingWidget />
      <FeaturedVehicles />
      <ServicesSection />
      <WhyChoose />
      <HowItWorks />
      <Destinations />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </>
  );
}
