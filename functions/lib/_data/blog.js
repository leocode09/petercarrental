"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPosts = void 0;
exports.getBlogPostBySlug = getBlogPostBySlug;
exports.blogPosts = [
    {
        slug: "best-cars-for-rwanda-road-trips",
        title: "Best Cars for Rwanda Road Trips",
        excerpt: "Discover the ideal vehicles for exploring Rwanda's scenic routes and national parks.",
        category: "Road Trips",
        readingTime: "5 min read",
        date: "Mar 2026",
        image: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200&q=80",
        highlights: [
            "Choose a vehicle with enough luggage space for park routes and overnight stays.",
            "Comfort matters on longer drives between Kigali, Akagera, Volcanoes, and Nyungwe.",
            "A safari-ready 4x4 is best when your itinerary includes park access or rougher terrain.",
        ],
        sections: [
            {
                heading: "Match the vehicle to the route",
                body: "City trips and conference schedules are usually best handled by a sedan or compact SUV, while national park routes benefit from stronger clearance, extra luggage space, and added comfort for longer driving days.",
            },
            {
                heading: "Think beyond the daily rate",
                body: "The most affordable option is not always the most practical. Passenger count, road conditions, luggage, and how often you will move between destinations all affect which vehicle gives you the best overall value.",
            },
            {
                heading: "Plan for your itinerary",
                body: "If your trip mixes business in Kigali with leisure travel outside the city, booking a flexible SUV often gives the best balance. For safari-heavy plans, a 4x4 keeps the journey smoother from the first pickup to the final drop-off.",
            },
        ],
    },
    {
        slug: "self-drive-tips-in-rwanda",
        title: "Self-Drive Tips in Rwanda",
        excerpt: "Essential driving advice for visitors renting a car and exploring the Land of a Thousand Hills.",
        category: "Self-Drive",
        readingTime: "4 min read",
        date: "Mar 2026",
        image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=1200&q=80",
        highlights: [
            "Keep your planned route and arrival windows realistic, especially outside Kigali.",
            "Confirm pickup timing, road conditions, and support contacts before you leave.",
            "Choose a vehicle category that fits both the passengers and the terrain.",
        ],
        sections: [
            {
                heading: "Drive with a realistic schedule",
                body: "Rwanda's roads are generally well maintained, but travel times can still change with traffic, weather, and mountainous routes. Build extra time into your plan so the drive stays comfortable instead of rushed.",
            },
            {
                heading: "Prepare before departure",
                body: "Before leaving the pickup point, review your route, fuel expectations, luggage space, and handoff contact details. A two-minute check early on can prevent unnecessary delays later in the day.",
            },
            {
                heading: "Choose the right support option",
                body: "Self-drive is ideal when you want flexibility, but some trips are easier with a driver or airport coordination added. If your itinerary changes, sending an updated request early helps the reservations team respond faster.",
            },
        ],
    },
    {
        slug: "kigali-airport-pickup-guide",
        title: "Kigali Airport Pickup Guide",
        excerpt: "Everything you need to know about arranging airport transfers for a smooth arrival.",
        category: "Airport Transfers",
        readingTime: "3 min read",
        date: "Mar 2026",
        image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1200&q=80",
        highlights: [
            "Share your arrival time early so pickup coordination can be prepared correctly.",
            "Airport pickup requests work best when hotel and contact details are included.",
            "Group arrivals should confirm luggage needs in advance.",
        ],
        sections: [
            {
                heading: "Send the right arrival details",
                body: "The fastest way to organize an airport pickup is to send your arrival date, time, drop-off point, and the number of travelers in one message. That gives the team enough context to prepare the right vehicle from the start.",
            },
            {
                heading: "Coordinate the handoff clearly",
                body: "If you are heading to a hotel, conference venue, or custom address, include it with your booking request. Clear destination details reduce back-and-forth and help the pickup stay on schedule.",
            },
            {
                heading: "Plan for return transfers too",
                body: "If you already know your departure date, include that information in the first request. Bundling arrival and departure transport often makes airport coordination much smoother across the full trip.",
            },
        ],
    },
];
function getBlogPostBySlug(slug) {
    return exports.blogPosts.find((post) => post.slug === slug);
}
//# sourceMappingURL=blog.js.map