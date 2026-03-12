import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { db } from "./firebase";
import { siteSettingKey } from "./validators";

export type CompanyInfo = {
  name: string;
  defaultTitle: string;
  shortDescription: string;
  metaDescription: string;
  phoneDisplay: string;
  phoneNumber: string;
  email: string;
  whatsappNumber: string;
  locationShort: string;
  locationFull: string;
  canonicalUrl: string;
  liveUrl: string;
  heroImage: string;
  ogImage: string;
  telHref: string;
  mailtoHref: string;
  whatsappHref: string;
  whatsappShareHref: string;
};

export type LinkItem = {
  label: string;
  to: string;
  description?: string;
};

export type NavLink = LinkItem & { children?: LinkItem[] };

export type PublicVehicle = {
  id: string;
  publicId: string;
  sortOrder: number;
  name: string;
  category: string;
  pricePerDay: number;
  transmission: string;
  seats: number;
  luggage: number;
  drive: string;
  fuel: string;
  description: string;
  image: string;
  featured: boolean;
  badge?: string;
};

export type PublicService = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  route?: string;
  menuLabel?: string;
  shortDescription?: string;
  teaser?: string;
  longDescription?: string;
  iconKey?: string;
  heroImage?: string;
  idealFor?: string[];
  inclusions?: string[];
  recommendedVehicleIds?: string[];
  sortOrder: number;
  [key: string]: unknown;
};

export type PublicDestination = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  route?: string;
  tagline?: string;
  shortDescription?: string;
  longDescription?: string;
  highlights?: string[];
  bestVehicleId?: string;
  serviceSlug?: string;
  image?: string;
  sortOrder: number;
  [key: string]: unknown;
};

export type PublicBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published?: boolean;
  sortOrder: number;
  [key: string]: unknown;
};

export type PublicTestimonial = {
  id: string;
  publicId: string;
  author: string;
  quote: string;
  summary: string;
  sortOrder: number;
};

export type LeadershipMember = {
  name: string;
  title: string;
  bio: string;
};

export type PublicSiteData = {
  companyInfo: CompanyInfo;
  bookingLocations: string[];
  serviceTypes: string[];
  navLinks: NavLink[];
  quickLinks: LinkItem[];
  footerServiceLinks: LinkItem[];
  legalLinks: LinkItem[];
  leadershipMembers: LeadershipMember[];
  vehicles: PublicVehicle[];
  services: PublicService[];
  destinations: PublicDestination[];
  blogPosts: PublicBlogPost[];
  testimonials: PublicTestimonial[];
};

async function fetchSiteContent(settings: Record<string, unknown>): Promise<PublicSiteData> {
  const [vehiclesSnap, servicesSnap, destinationsSnap, blogSnap, testimonialsSnap] =
    await Promise.all([
      getDocs(query(collection(db, "vehicles"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "services"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "destinations"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "blogPosts"), orderBy("sortOrder", "asc"))),
      getDocs(query(collection(db, "testimonials"), orderBy("sortOrder", "asc"))),
    ]);

  const vehicles = vehiclesSnap.docs.map((d) => {
    const data = d.data() as { publicId: string } & Record<string, unknown>;
    return { id: data.publicId ?? d.id, ...data };
  }) as PublicVehicle[];

  const servicesData = servicesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as PublicService[];
  const destinationsData = destinationsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as PublicDestination[];

  const blogPostsData = blogSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p: { published?: boolean }) => p.published)
    .sort((a: { sortOrder?: number }, b: { sortOrder?: number }) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) as PublicBlogPost[];

  const testimonialsData = testimonialsSnap.docs.map((d) => {
    const data = d.data() as { publicId?: string } & Record<string, unknown>;
    return {
      id: (data.publicId as string) ?? d.id,
      publicId: (data.publicId as string) ?? d.id,
      ...data,
    };
  }) as PublicTestimonial[];

  return {
    companyInfo: (settings.companyInfo as CompanyInfo) ?? defaultCompanyInfo(),
    bookingLocations: (settings.bookingLocations as string[]) ?? [],
    serviceTypes: (settings.serviceTypes as string[]) ?? [],
    navLinks: (settings.navLinks as NavLink[]) ?? [],
    quickLinks: (settings.quickLinks as LinkItem[]) ?? [],
    footerServiceLinks: (settings.footerServiceLinks as LinkItem[]) ?? [],
    legalLinks: (settings.legalLinks as LinkItem[]) ?? [],
    leadershipMembers: (settings.leadershipMembers as LeadershipMember[]) ?? [],
    vehicles,
    services: servicesData,
    destinations: destinationsData,
    blogPosts: blogPostsData,
    testimonials: testimonialsData,
  };
}

function defaultCompanyInfo(): CompanyInfo {
  return {
    name: "Peter Car Rental",
    defaultTitle: "Peter Car Rental | Premium Car Hire in Kigali, Rwanda",
    shortDescription: "Rwanda's trusted premium car rental service.",
    metaDescription: "Peter Car Rental offers premium car hire in Rwanda.",
    phoneDisplay: "+250 788 237 438",
    phoneNumber: "+250788237438",
    email: "info@petercarrental.rw",
    whatsappNumber: "250788237438",
    locationShort: "Kigali, Rwanda",
    locationFull: "Kigali, Kicukiro, Rwanda",
    canonicalUrl: "https://petercarrental.rw",
    liveUrl: "https://petercarrental.lovable.app",
    heroImage: "",
    ogImage: "",
    telHref: "tel:+250788237438",
    mailtoHref: "mailto:info@petercarrental.rw",
    whatsappHref: "https://wa.me/250788237438",
    whatsappShareHref: "https://wa.me/250788237438",
  };
}

export function usePublicSiteData() {
  const [data, setData] = useState<PublicSiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "siteSettings", siteSettingKey),
      async (snap) => {
        if (!snap.exists()) {
          setData(null);
          setLoading(false);
          return;
        }
        try {
          const content = await fetchSiteContent(snap.data());
          setData(content);
        } catch (err) {
          console.error("Failed to fetch site content", err);
          setData(null);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("Firestore siteSettings listener error", err);
        setData(null);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { data, loading };
}

export function getVehicleByQueryValue(
  vehicles: PublicVehicle[],
  value?: string | null
): PublicVehicle | undefined {
  if (!value) return undefined;
  const v = value.trim().toLowerCase();
  return vehicles.find(
    (vehicle) =>
      vehicle.id.toLowerCase() === v || vehicle.publicId?.toLowerCase() === v
  );
}

export function getVehicleCategories(vehicles: PublicVehicle[]): string[] {
  const cats = new Set(vehicles.map((v) => v.category));
  return Array.from(cats).sort();
}

export function getFeaturedVehicles(vehicles: PublicVehicle[]): PublicVehicle[] {
  return vehicles.filter((v) => v.featured);
}

export function getServiceBySlug(
  services: PublicService[],
  slug: string
): PublicService | undefined {
  return services.find((s) => s.slug === slug);
}

export function getDestinationBySlug(
  destinations: PublicDestination[],
  slug: string
): PublicDestination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getBlogPostBySlug(
  blogPosts: PublicBlogPost[],
  slug: string
): PublicBlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
