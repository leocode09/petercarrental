import {
  usePublicSiteData as useFirestorePublicData,
  type PublicSiteData,
} from "./firestore-public";

export type { PublicSiteData };

/** Returns { data, loading }. For admin compatibility, spreads data so you can use { companyInfo, vehicles, ... }. */
export function usePublicSiteData() {
  const { data, loading } = useFirestorePublicData();
  return {
    ...(data ?? {}),
    loading,
  } as PublicSiteData & { loading: boolean };
}

export function getVehicleByQueryValueFromList(
  vehicleList: PublicSiteData["vehicles"],
  value: string | undefined | null
) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = decodeURIComponent(value).trim().toLowerCase();

  return vehicleList.find(
    (vehicle) =>
      (vehicle as { publicId?: string }).publicId?.toLowerCase?.() === normalizedValue ||
      (vehicle as { id?: string }).id?.toLowerCase?.() === normalizedValue ||
      vehicle.name.trim().toLowerCase() === normalizedValue
  );
}

export function getServiceBySlugFromList(
  serviceList: PublicSiteData["services"],
  slug: string | undefined
) {
  return serviceList.find(
    (service) => service.slug === slug || service.aliases?.includes(slug ?? "")
  );
}

export function getDestinationBySlugFromList(
  destinationList: PublicSiteData["destinations"],
  slug: string | undefined
) {
  return destinationList.find(
    (destination) =>
      destination.slug === slug || destination.aliases?.includes(slug ?? "")
  );
}

export function getBlogPostBySlugFromList(
  postList: PublicSiteData["blogPosts"],
  slug: string | undefined
) {
  return postList.find((post) => post.slug === slug);
}

export function getVehicleCategoriesFromList(
  vehicleList: PublicSiteData["vehicles"]
) {
  return Array.from(new Set(vehicleList.map((vehicle) => vehicle.category)));
}

export function getFeaturedVehicles(vehicleList: PublicSiteData["vehicles"]) {
  return vehicleList.filter((vehicle) => vehicle.featured);
}
