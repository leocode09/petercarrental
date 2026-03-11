import { query } from "./_generated/server";
import { siteSettingKey } from "./lib/validators";

export const getSiteContent = query({
  args: {},
  handler: async (ctx) => {
    const [settings, vehicles, services, destinations, blogPosts, testimonials] = await Promise.all([
      ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", siteSettingKey)).first(),
      ctx.db.query("vehicles").collect(),
      ctx.db.query("services").collect(),
      ctx.db.query("destinations").collect(),
      ctx.db.query("blogPosts").collect(),
      ctx.db.query("testimonials").collect(),
    ]);

    if (!settings) {
      return null;
    }

    return {
      companyInfo: settings.companyInfo,
      bookingLocations: settings.bookingLocations,
      serviceTypes: settings.serviceTypes,
      navLinks: settings.navLinks,
      quickLinks: settings.quickLinks,
      footerServiceLinks: settings.footerServiceLinks,
      legalLinks: settings.legalLinks,
      leadershipMembers: settings.leadershipMembers,
      vehicles: vehicles.sort((left, right) => left.sortOrder - right.sortOrder),
      services: services.sort((left, right) => left.sortOrder - right.sortOrder),
      destinations: destinations.sort((left, right) => left.sortOrder - right.sortOrder),
      blogPosts: blogPosts
        .filter((post) => post.published)
        .sort((left, right) => left.sortOrder - right.sortOrder),
      testimonials: testimonials.sort((left, right) => left.sortOrder - right.sortOrder),
    };
  },
});
