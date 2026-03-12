"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legalLinks = exports.footerServiceLinks = exports.quickLinks = exports.navLinks = exports.destinationMenuLinks = exports.serviceMenuLinks = exports.fleetMenuLinks = exports.serviceTypes = exports.bookingLocations = exports.companyInfo = void 0;
exports.companyInfo = {
    name: "Peter Car Rental",
    defaultTitle: "Peter Car Rental | Premium Car Hire in Kigali, Rwanda",
    shortDescription: "Rwanda's trusted premium car rental service. Self-drive, chauffeur, airport transfers, and safari vehicles - all backed by professional support.",
    metaDescription: "Peter Car Rental offers premium self-drive and chauffeur car rental services in Rwanda. Airport transfers, corporate rentals. Book now!",
    phoneDisplay: "+250 788 237 438",
    phoneNumber: "+250788237438",
    email: "info@petercarrental.rw",
    whatsappNumber: "250788237438",
    locationShort: "Kigali, Rwanda",
    locationFull: "Kigali, Kicukiro, Rwanda",
    canonicalUrl: "https://petercarrental.rw",
    liveUrl: "https://petercarrental.lovable.app",
    heroImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80",
    ogImage: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/423ff39b-d1ce-4a0d-ab41-b4b0dd992e47/id-preview-a843ce9c--81b7c23b-efba-42ee-9bae-9f8f513d5311.lovable.app-1773009722381.png",
    telHref: "tel:+250788237438",
    mailtoHref: "mailto:info@petercarrental.rw",
    whatsappHref: "https://wa.me/250788237438",
    whatsappShareHref: "https://api.whatsapp.com/send/?phone=250788237438&text&type=phone_number&app_absent=0",
};
exports.bookingLocations = [
    "Kigali Airport",
    "Kigali City Center",
    "Hotel Delivery",
    "Custom Location",
    "Same as pickup",
];
exports.serviceTypes = ["Self-Drive", "With Chauffeur"];
exports.fleetMenuLinks = [
    { label: "All Vehicles", to: "/fleet" },
    { label: "SUV & Safari Fleet", to: "/fleet?category=4x4+Safari" },
    { label: "Sedan & Economy", to: "/fleet?category=Sedan" },
    { label: "Luxury Travel", to: "/fleet?category=Luxury" },
    { label: "Vans & Group Travel", to: "/fleet?category=Van+%2F+Bus" },
];
exports.serviceMenuLinks = [
    { label: "Self-Drive", to: "/services/self-drive" },
    { label: "Chauffeur Services", to: "/services/chauffeur" },
    { label: "Airport Transfers", to: "/services/airport-transfers" },
    { label: "Corporate Rentals", to: "/services/corporate" },
    { label: "Long-Term Rental", to: "/services/long-term" },
    { label: "Safari & 4x4", to: "/services/safari" },
];
exports.destinationMenuLinks = [
    { label: "Kigali City", to: "/destinations/kigali" },
    { label: "Akagera National Park", to: "/destinations/akagera" },
    { label: "Volcanoes National Park", to: "/destinations/volcanoes" },
    { label: "Nyungwe Forest", to: "/destinations/nyungwe" },
];
exports.navLinks = [
    { label: "Home", to: "/" },
    { label: "Fleet", to: "/fleet", children: exports.fleetMenuLinks },
    { label: "Services", to: "/services", children: exports.serviceMenuLinks },
    { label: "Destinations", to: "/destinations", children: exports.destinationMenuLinks },
    { label: "About", to: "/about" },
    { label: "Blog", to: "/blog" },
    { label: "Contact", to: "/contact" },
];
exports.quickLinks = [
    { label: "Our Fleet", to: "/fleet" },
    { label: "Book Now", to: "/booking" },
    { label: "About Us", to: "/about" },
    { label: "Leadership", to: "/leadership" },
    { label: "Blog", to: "/blog" },
    { label: "FAQ", to: "/faq" },
    { label: "Gallery", to: "/gallery" },
    { label: "Reviews", to: "/reviews" },
    { label: "Contact", to: "/contact" },
];
exports.footerServiceLinks = [
    { label: "Self-Drive Rentals", to: "/services/self-drive" },
    { label: "Chauffeur Services", to: "/services/chauffeur" },
    { label: "Airport Transfers", to: "/services/airport-transfers" },
    { label: "Corporate Rentals", to: "/services/corporate" },
    { label: "Long-Term Rental", to: "/services/long-term" },
    { label: "Safari & 4x4", to: "/services/safari" },
    { label: "Manage Booking", to: "/manage-booking" },
    { label: "Complaints", to: "/complaints" },
];
exports.legalLinks = [
    { label: "Terms & Conditions", to: "/terms" },
    { label: "Privacy Policy", to: "/privacy" },
    { label: "Cookie Policy", to: "/cookies" },
    { label: "Refund Policy", to: "/refunds" },
    { label: "Booking Terms", to: "/booking-terms" },
];
//# sourceMappingURL=site.js.map