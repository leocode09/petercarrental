export interface Vehicle {
  id: string;
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
}

export const vehicleCategories = [
  "Economy",
  "Sedan",
  "SUV",
  "4x4 Safari",
  "Luxury",
  "Van / Bus",
];

export const vehicles: Vehicle[] = [
  {
    id: "rav4",
    name: "Toyota RAV4",
    category: "SUV",
    pricePerDay: 55,
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    drive: "AWD",
    fuel: "Petrol",
    description: "A versatile SUV built for Kigali business trips, scenic drives, and comfortable family travel.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
    featured: true,
    badge: "Popular",
  },
  {
    id: "prado",
    name: "Land Cruiser Prado",
    category: "4x4 Safari",
    pricePerDay: 95,
    transmission: "Automatic",
    seats: 7,
    luggage: 4,
    drive: "4x4",
    fuel: "Diesel",
    description: "Our go-to premium 4x4 for Akagera safaris, mountain routes, and high-comfort adventure travel.",
    image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80",
    featured: true,
    badge: "Safari Ready",
  },
  {
    id: "corolla",
    name: "Toyota Corolla",
    category: "Sedan",
    pricePerDay: 45,
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    drive: "FWD",
    fuel: "Petrol",
    description: "Reliable, efficient, and ideal for city meetings, airport pickups, and smooth day-to-day driving.",
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80",
    featured: true,
  },
  {
    id: "e-class",
    name: "Mercedes-Benz E-Class",
    category: "Luxury",
    pricePerDay: 145,
    transmission: "Automatic",
    seats: 5,
    luggage: 3,
    drive: "RWD",
    fuel: "Petrol",
    description: "Executive luxury for VIP arrivals, weddings, diplomatic travel, and special event transfers.",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=1200&q=80",
    featured: true,
    badge: "Executive",
  },
  {
    id: "hilux",
    name: "Toyota Hilux",
    category: "4x4 Safari",
    pricePerDay: 88,
    transmission: "Manual",
    seats: 5,
    luggage: 4,
    drive: "4x4",
    fuel: "Diesel",
    description: "Rugged, dependable, and well suited for field work, long-term NGO needs, and rougher terrain.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1200&q=80",
    featured: true,
  },
  {
    id: "hiace",
    name: "Toyota Hiace",
    category: "Van / Bus",
    pricePerDay: 120,
    transmission: "Manual",
    seats: 14,
    luggage: 8,
    drive: "RWD",
    fuel: "Diesel",
    description: "Comfortable people-mover for airport transfers, team travel, tours, and event logistics.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
    featured: true,
  },
];

export const featuredVehicles = vehicles.filter((vehicle) => vehicle.featured);
