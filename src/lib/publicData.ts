import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { blogPosts } from "../data/blog";
import { destinations } from "../data/destinations";
import { leadershipMembers } from "../data/leadership";
import { companyInfo, bookingLocations, footerServiceLinks, legalLinks, navLinks, quickLinks, serviceTypes } from "../data/site";
import { services } from "../data/services";
import { testimonials } from "../data/testimonials";
import { vehicles } from "../data/vehicles";

export const fallbackPublicData = {
  companyInfo,
  bookingLocations,
  serviceTypes,
  navLinks,
  quickLinks,
  footerServiceLinks,
  legalLinks,
  leadershipMembers,
  vehicles,
  services,
  destinations,
  blogPosts,
  testimonials,
};

export type PublicSiteData = typeof fallbackPublicData;

export function usePublicSiteData() {
  const convexData = useQuery(api.public.getSiteContent, {});
  return convexData ?? fallbackPublicData;
}

export function getVehicleByQueryValueFromList(vehicleList: PublicSiteData["vehicles"], value: string | undefined | null) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = decodeURIComponent(value).trim().toLowerCase();

  return vehicleList.find(
    (vehicle) =>
      vehicle.publicId?.toLowerCase?.() === normalizedValue ||
      vehicle.id?.toLowerCase?.() === normalizedValue ||
      vehicle.name.trim().toLowerCase() === normalizedValue,
  );
}

export function getServiceBySlugFromList(serviceList: PublicSiteData["services"], slug: string | undefined) {
  return serviceList.find((service) => service.slug === slug || service.aliases?.includes(slug ?? ""));
}

export function getDestinationBySlugFromList(destinationList: PublicSiteData["destinations"], slug: string | undefined) {
  return destinationList.find((destination) => destination.slug === slug || destination.aliases?.includes(slug ?? ""));
}

export function getBlogPostBySlugFromList(postList: PublicSiteData["blogPosts"], slug: string | undefined) {
  return postList.find((post) => post.slug === slug);
}

export function getVehicleCategoriesFromList(vehicleList: PublicSiteData["vehicles"]) {
  return Array.from(new Set(vehicleList.map((vehicle) => vehicle.category)));
}

export function getFeaturedVehicles(vehicleList: PublicSiteData["vehicles"]) {
  return vehicleList.filter((vehicle) => vehicle.featured);
}
