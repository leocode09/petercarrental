import { companyInfo } from "./site";

export type ServiceIconKey =
  | "selfDrive"
  | "chauffeur"
  | "airport"
  | "corporate"
  | "longTerm"
  | "safari"
  | "events";

export interface Service {
  slug: string;
  route: string;
  aliases?: string[];
  name: string;
  menuLabel: string;
  shortDescription: string;
  teaser: string;
  longDescription: string;
  iconKey: ServiceIconKey;
  heroImage: string;
  idealFor: string[];
  inclusions: string[];
  featured: boolean;
  hideFromMenu?: boolean;
  recommendedVehicleIds: string[];
}

export const services: Service[] = [
  {
    slug: "self-drive",
    route: "/services/self-drive",
    name: "Self-Drive Rentals",
    menuLabel: "Self-Drive",
    shortDescription: "Explore Rwanda at your own pace with our well-maintained vehicles.",
    teaser:
      "Take the wheel and explore Rwanda at your own pace. Our well-maintained vehicles come with comprehensive insurance, 24/7 roadside assistance, and flexible pickup/drop-off options.",
    longDescription:
      "Our self-drive service is designed for travelers who value privacy, freedom, and flexibility. Pick your vehicle, choose your itinerary, and enjoy well-prepared cars backed by a responsive support team.",
    iconKey: "selfDrive",
    heroImage: companyInfo.heroImage,
    idealFor: ["Independent travelers", "Business visitors", "Families and couples", "Road trips across Rwanda"],
    inclusions: ["Comprehensive insurance", "Roadside assistance", "Flexible pickup and return", "Well-serviced modern fleet"],
    featured: true,
    recommendedVehicleIds: ["rav4", "corolla", "prado"],
  },
  {
    slug: "chauffeur",
    route: "/services/chauffeur",
    aliases: ["city-tour"],
    name: "Chauffeur Services",
    menuLabel: "Chauffeur Services",
    shortDescription: "Professional drivers who know every road and destination in Rwanda.",
    teaser:
      "Travel stress-free with a professional driver who knows Kigali, national parks, border routes, and your schedule inside out.",
    longDescription:
      "From executive travel to family tours, our chauffeur service delivers punctuality, polished presentation, and local expertise. Perfect when you want convenience without sacrificing comfort.",
    iconKey: "chauffeur",
    heroImage:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["VIP arrivals", "Corporate meetings", "First-time visitors", "Wedding and event transport"],
    inclusions: ["Experienced drivers", "Meet-and-greet support", "Flexible hourly or daily hire", "Comfort-focused vehicles"],
    featured: true,
    recommendedVehicleIds: ["e-class", "corolla", "hiace"],
  },
  {
    slug: "airport-transfers",
    route: "/services/airport-transfers",
    aliases: ["airport-transfer"],
    name: "Airport Transfers",
    menuLabel: "Airport Transfers",
    shortDescription: "Seamless pickup and drop-off at Kigali International Airport.",
    teaser:
      "Arrive in Kigali with total peace of mind. We track your flight, handle the handoff smoothly, and get you moving with zero delay.",
    longDescription:
      "Our airport transfer service combines reliable timing, polished hospitality, and transparent pricing. Whether you need a solo transfer or a group pickup, we make arrivals and departures effortless.",
    iconKey: "airport",
    heroImage:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["Business travelers", "Tourists arriving in Kigali", "Hotel transfers", "Late-night or early-morning flights"],
    inclusions: ["Flight monitoring", "Meet-and-greet upon request", "Comfortable luggage-friendly vehicles", "24/7 scheduling"],
    featured: true,
    recommendedVehicleIds: ["corolla", "rav4", "hiace"],
  },
  {
    slug: "corporate",
    route: "/services/corporate",
    name: "Corporate & NGO",
    menuLabel: "Corporate Rentals",
    shortDescription: "Dedicated fleet solutions for organizations, embassies, and projects.",
    teaser:
      "Business teams, embassies, and NGOs rely on our dependable vehicles, account support, and scalable transport coordination.",
    longDescription:
      "We support organizations with dependable fleet allocation, long-running assignments, project-based deployments, and account-level flexibility. Our team understands the pace and precision institutional clients need.",
    iconKey: "corporate",
    heroImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["NGO field work", "Embassy operations", "Corporate guests", "Project-based transport"],
    inclusions: ["Monthly invoicing options", "Fleet rotation support", "Dedicated account handling", "Custom rental durations"],
    featured: true,
    recommendedVehicleIds: ["hilux", "corolla", "hiace"],
  },
  {
    slug: "long-term",
    route: "/services/long-term",
    name: "Long-Term Rental",
    menuLabel: "Long-Term Rental",
    shortDescription: "Competitive monthly rates for extended stays and ongoing projects.",
    teaser:
      "Stay mobile for weeks or months with flexible long-term packages, dependable maintenance, and responsive support whenever you need it.",
    longDescription:
      "Our long-term rental plans are tailored for consultants, project teams, returning residents, and organizations needing reliable mobility without the hassle of ownership.",
    iconKey: "longTerm",
    heroImage:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["Consultants on assignment", "Project vehicles", "Extended vacations", "Relocating professionals"],
    inclusions: ["Preferential monthly pricing", "Routine servicing support", "Vehicle swap flexibility", "Priority customer care"],
    featured: true,
    recommendedVehicleIds: ["hilux", "rav4", "corolla"],
  },
  {
    slug: "safari",
    route: "/services/safari",
    name: "Safari & 4x4",
    menuLabel: "Safari & 4x4",
    shortDescription: "Rugged vehicles built for national parks and off-road adventures.",
    teaser:
      "Go beyond the city with safari-ready 4x4 vehicles designed for Akagera, Volcanoes, Nyungwe, and every scenic route in between.",
    longDescription:
      "Our safari fleet is selected for comfort, capability, and confidence on mixed terrain. When your itinerary includes park gates, mountain roads, or long scenic stretches, this is the right fit.",
    iconKey: "safari",
    heroImage:
      "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["Akagera safaris", "Gorilla trekking", "Photographic road trips", "Remote lodge transfers"],
    inclusions: ["4x4-capable fleet", "Adventure-friendly vehicles", "Optional driver support", "Trip-planning guidance"],
    featured: true,
    recommendedVehicleIds: ["prado", "hilux", "rav4"],
  },
  {
    slug: "wedding-events",
    route: "/services/wedding-events",
    name: "Wedding & Events",
    menuLabel: "Wedding & Events",
    shortDescription: "Elegant vehicles for your special day and memorable occasions.",
    teaser:
      "Add polish, comfort, and reliability to your celebration with event transport tailored to your schedule and style.",
    longDescription:
      "From VIP shuttles to bridal arrivals, we coordinate polished event transport that feels premium from first pickup to final drop-off.",
    iconKey: "events",
    heroImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
    idealFor: ["Weddings", "Private celebrations", "Executive events", "Guest transport coordination"],
    inclusions: ["Flexible scheduling", "Premium presentation", "Driver options", "Tailored event support"],
    featured: true,
    hideFromMenu: true,
    recommendedVehicleIds: ["e-class", "hiace", "rav4"],
  },
];

export const primaryServices = services.filter((service) => !service.hideFromMenu);

export function getServiceBySlug(slug: string | undefined) {
  return services.find((service) => service.slug === slug || service.aliases?.includes(slug ?? ""));
}
