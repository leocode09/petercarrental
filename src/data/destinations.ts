export interface Destination {
  slug: string;
  route: string;
  aliases?: string[];
  name: string;
  tagline: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  bestVehicleId: string;
  serviceSlug: string;
  image: string;
}

export const destinations: Destination[] = [
  {
    slug: "kigali",
    route: "/destinations/kigali",
    name: "Kigali City",
    tagline: "Business & urban exploration",
    shortDescription: "Discover Kigali's clean avenues, conference venues, cafes, and neighborhoods with a reliable city-ready ride.",
    longDescription:
      "Kigali is the perfect place for smooth sedans, executive transfers, and flexible day-hire options. Whether you're in town for meetings or leisure, our fleet keeps you moving with ease.",
    highlights: ["Airport-to-hotel transfers", "Conference and embassy access", "Day tours and city exploration", "Flexible same-day schedules"],
    bestVehicleId: "corolla",
    serviceSlug: "chauffeur",
    image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "akagera",
    route: "/destinations/akagera",
    aliases: ["akagera-national-park"],
    name: "Akagera National Park",
    tagline: "Big Five safari adventures",
    shortDescription: "Head east in a safari-ready 4x4 built for game drives, lodge transfers, and long scenic stretches.",
    longDescription:
      "Akagera rewards travelers who want comfort and capability. Our safari fleet gives you the confidence to enjoy the journey as much as the wildlife experience itself.",
    highlights: ["Early-morning park departures", "Lodge and camp access", "Comfort on mixed terrain", "Ideal for photography gear and luggage"],
    bestVehicleId: "prado",
    serviceSlug: "safari",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "volcanoes",
    route: "/destinations/volcanoes",
    aliases: ["volcanoes-national-park"],
    name: "Volcanoes National Park",
    tagline: "Gorilla trekking & mountains",
    shortDescription: "Choose a dependable SUV or 4x4 for cool mountain mornings, trekking logistics, and scenic northern routes.",
    longDescription:
      "Volcanoes National Park combines some of Rwanda's most dramatic landscapes with tight schedules and premium travel moments. A well-prepared vehicle makes the experience smoother from Kigali to the trailhead.",
    highlights: ["Comfortable transfer from Kigali", "Space for trekking gear", "Reliable handling on mountain roads", "Ideal for honeymoon and luxury travel"],
    bestVehicleId: "rav4",
    serviceSlug: "safari",
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
  },
  {
    slug: "nyungwe",
    route: "/destinations/nyungwe",
    aliases: ["nyungwe-forest"],
    name: "Nyungwe Forest",
    tagline: "Canopy walks & primates",
    shortDescription: "Travel southwest in comfort for forest stays, primate experiences, and immersive multi-day itineraries.",
    longDescription:
      "Nyungwe journeys benefit from dependable vehicles with luggage space, strong highway comfort, and responsive support for longer itineraries. It's ideal for travelers balancing nature, comfort, and time efficiency.",
    highlights: ["Multi-day itinerary support", "Road-trip comfort", "Great for couples and private tours", "Flexible pickup and return planning"],
    bestVehicleId: "hilux",
    serviceSlug: "long-term",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
  },
];

export function getDestinationBySlug(slug: string | undefined) {
  return destinations.find((destination) => destination.slug === slug || destination.aliases?.includes(slug ?? ""));
}
