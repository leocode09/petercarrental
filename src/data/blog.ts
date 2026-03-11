export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readingTime: string;
  date: string;
  image: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-cars-for-rwanda-road-trips",
    title: "Best Cars for Rwanda Road Trips",
    excerpt: "Discover the ideal vehicles for exploring Rwanda's scenic routes and national parks.",
    category: "Road Trips",
    readingTime: "5 min read",
    date: "Mar 2026",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80",
  },
  {
    slug: "self-drive-tips-in-rwanda",
    title: "Self-Drive Tips in Rwanda",
    excerpt: "Essential driving advice for visitors renting a car and exploring the Land of a Thousand Hills.",
    category: "Self-Drive",
    readingTime: "4 min read",
    date: "Mar 2026",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
  },
  {
    slug: "kigali-airport-pickup-guide",
    title: "Kigali Airport Pickup Guide",
    excerpt: "Everything you need to know about arranging airport transfers for a smooth arrival.",
    category: "Airport Transfers",
    readingTime: "3 min read",
    date: "Mar 2026",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80",
  },
];
