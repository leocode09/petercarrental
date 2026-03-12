import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import { blogPosts } from "../data/blog";
import { destinations } from "../data/destinations";
import { leadershipMembers } from "../data/leadership";
import {
  companyInfo,
  bookingLocations,
  footerServiceLinks,
  legalLinks,
  navLinks,
  quickLinks,
  serviceTypes,
} from "../data/site";
import { services } from "../data/services";
import { testimonials } from "../data/testimonials";
import { vehicles } from "../data/vehicles";
import { siteSettingKey } from "./validators";

export const fallbackPublicData = {
  companyInfo,
  bookingLocations,
  serviceTypes,
  navLinks,
  quickLinks,
  footerServiceLinks,
  legalLinks,
  leadershipMembers,
  vehicles: vehicles.map((v, i) => ({
    id: v.id,
    publicId: v.id,
    sortOrder: i,
    name: v.name,
    category: v.category,
    pricePerDay: v.pricePerDay,
    transmission: v.transmission,
    seats: v.seats,
    luggage: v.luggage,
    drive: v.drive,
    fuel: v.fuel,
    description: v.description,
    image: v.image,
    featured: v.featured,
    badge: v.badge,
  })),
  services: services.map((s, i) => ({ ...s, sortOrder: i })),
  destinations: destinations.map((d, i) => ({ ...d, sortOrder: i })),
  blogPosts,
  testimonials: testimonials.map((t, i) => ({
    id: t.id,
    publicId: t.id,
    author: t.author,
    quote: t.quote,
    summary: t.summary,
    sortOrder: i,
  })),
};

export type PublicSiteData = typeof fallbackPublicData;

async function fetchSiteContent(): Promise<PublicSiteData | null> {
  const settingsSnap = await getDoc(doc(db, "siteSettings", siteSettingKey));
  if (!settingsSnap.exists()) {
    return null;
  }

  const settings = settingsSnap.data();
  const [vehiclesSnap, servicesSnap, destinationsSnap, blogSnap, testimonialsSnap] =
    await Promise.all([
      getDocs(query(collection(db, "vehicles"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "services"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "destinations"), orderBy("sortOrder", "asc"))),
      getDocs(
        query(
          collection(db, "blogPosts"),
          orderBy("sortOrder", "asc")
        )
      ),
      getDocs(
        query(
          collection(db, "testimonials"),
          orderBy("sortOrder", "asc")
        )
      ),
    ]);

  const vehicles = vehiclesSnap.docs.map((d) => {
    const data = d.data() as { publicId: string } & Record<string, unknown>;
    return { id: data.publicId, ...data };
  });
  const servicesData = servicesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
  const destinationsData = destinationsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
  const blogPostsData = blogSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p: { published?: boolean }) => p.published)
    .sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const testimonialsData = testimonialsSnap.docs.map((d) => {
    const data = d.data() as { publicId?: string } & Record<string, unknown>;
    return {
      id: data.publicId ?? d.id,
      publicId: data.publicId ?? d.id,
      ...data,
    };
  });

  return {
    companyInfo: settings.companyInfo ?? fallbackPublicData.companyInfo,
    bookingLocations: settings.bookingLocations ?? fallbackPublicData.bookingLocations,
    serviceTypes: settings.serviceTypes ?? fallbackPublicData.serviceTypes,
    navLinks: settings.navLinks ?? fallbackPublicData.navLinks,
    quickLinks: settings.quickLinks ?? fallbackPublicData.quickLinks,
    footerServiceLinks: settings.footerServiceLinks ?? fallbackPublicData.footerServiceLinks,
    legalLinks: settings.legalLinks ?? fallbackPublicData.legalLinks,
    leadershipMembers: settings.leadershipMembers ?? fallbackPublicData.leadershipMembers,
    vehicles: vehicles as PublicSiteData["vehicles"],
    services: servicesData as PublicSiteData["services"],
    destinations: destinationsData as PublicSiteData["destinations"],
    blogPosts: blogPostsData as PublicSiteData["blogPosts"],
    testimonials: testimonialsData as PublicSiteData["testimonials"],
  };
}

export function usePublicSiteData() {
  const [data, setData] = useState<PublicSiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchSiteContent()
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch site content", err);
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return data ?? fallbackPublicData;
}
