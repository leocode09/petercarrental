export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  summary: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "sarah-johnson",
    quote: "Exceptional service! The Land Cruiser was perfect for our Akagera safari. Peter's team went above and beyond.",
    author: "Sarah Johnson",
    summary: "USA - Safari Trip - Land Cruiser Prado",
  },
  {
    id: "jean-pierre-habimana",
    quote: "I've used Peter Car Rental for months. Always reliable, always professional. Best corporate service in Kigali.",
    author: "Jean-Pierre Habimana",
    summary: "Rwanda - Business - Toyota Corolla",
  },
  {
    id: "emma-david-chen",
    quote: "Our gorilla trekking trip was made seamless by the team. The car was spotless and the driver was amazing.",
    author: "Emma & David Chen",
    summary: "UK - Honeymoon - RAV4",
  },
  {
    id: "dr-marie-uwimana",
    quote: "Flexible long-term rental with great rates. The fleet is well-maintained and support is always available.",
    author: "Dr. Marie Uwimana",
    summary: "NGO - Project Vehicle - Toyota Hilux",
  },
];
