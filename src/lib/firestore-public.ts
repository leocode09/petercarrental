import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
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

type ContentCollections = {
  vehicles: PublicVehicle[];
  services: PublicService[];
  destinations: PublicDestination[];
  blogPosts: PublicBlogPost[];
  testimonials: PublicTestimonial[];
};

const CONTENT_CACHE_TTL_MS = 30_000;

async function fetchContentCollections(): Promise<ContentCollections> {
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

  const services = servicesSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as PublicService[];
  const destinations = destinationsSnap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  })) as PublicDestination[];

  const blogPosts = (blogSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as PublicBlogPost)
    .filter((p) => p.published)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));

  const testimonials = testimonialsSnap.docs.map((d) => {
    const data = d.data() as { publicId?: string } & Record<string, unknown>;
    return {
      id: (data.publicId as string) ?? d.id,
      publicId: (data.publicId as string) ?? d.id,
      ...data,
    };
  }) as PublicTestimonial[];

  return { vehicles, services, destinations, blogPosts, testimonials };
}

function buildSiteData(settings: Record<string, unknown>, content: ContentCollections): PublicSiteData {
  return {
    companyInfo: (settings.companyInfo as CompanyInfo) ?? defaultCompanyInfo(),
    bookingLocations: (settings.bookingLocations as string[]) ?? [],
    serviceTypes: (settings.serviceTypes as string[]) ?? [],
    navLinks: (settings.navLinks as NavLink[]) ?? [],
    quickLinks: (settings.quickLinks as LinkItem[]) ?? [],
    footerServiceLinks: (settings.footerServiceLinks as LinkItem[]) ?? [],
    legalLinks: (settings.legalLinks as LinkItem[]) ?? [],
    leadershipMembers: (settings.leadershipMembers as LeadershipMember[]) ?? [],
    ...content,
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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const contentCacheRef = useRef<ContentCollections | null>(null);
  const contentFetchedAtRef = useRef(0);

  const retry = useCallback(() => {
    contentCacheRef.current = null;
    contentFetchedAtRef.current = 0;
    setLoading(true);
    setError(null);
    setData(null);
    setRetryCount((c) => c + 1);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    let graceTimer: ReturnType<typeof setTimeout> | undefined;
    let cancelled = false;

    async function getContent(): Promise<ContentCollections> {
      const now = Date.now();
      if (contentCacheRef.current && (now - contentFetchedAtRef.current) < CONTENT_CACHE_TTL_MS) {
        return contentCacheRef.current;
      }
      const content = await fetchContentCollections();
      if (!cancelled) {
        contentCacheRef.current = content;
        contentFetchedAtRef.current = Date.now();
      }
      return content;
    }

    const unsub = onSnapshot(
      doc(db, "siteSettings", siteSettingKey),
      async (snap) => {
        if (cancelled) return;
        if (!snap.exists()) {
          if (!graceTimer) {
            graceTimer = setTimeout(() => {
              if (!cancelled) {
                setError(
                  "Site settings not found. The database may not be seeded yet — " +
                  "check that the seedPublicData Cloud Function is deployed."
                );
                setLoading(false);
              }
            }, 12_000);
          }
          return;
        }
        clearTimeout(graceTimer);
        graceTimer = undefined;
        try {
          const content = await getContent();
          if (!cancelled) {
            setData(buildSiteData(snap.data(), content));
            setError(null);
          }
        } catch (err) {
          if (!cancelled) {
            console.error("Failed to fetch site content", err);
            setData(null);
            setError(
              err instanceof Error ? err.message : "Failed to fetch site content"
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
      },
      (err) => {
        clearTimeout(graceTimer);
        if (!cancelled) {
          console.error("Firestore siteSettings listener error", err);
          setData(null);
          setError(err.message ?? "Firestore connection error");
          setLoading(false);
        }
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(graceTimer);
      unsub();
    };
  }, [retryCount]);

  return { data, loading, error, retry };
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
