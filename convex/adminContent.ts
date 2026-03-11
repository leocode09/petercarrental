import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { logActivity, requireRole } from "./lib/auth";
import {
  blogSectionValidator,
  companyInfoValidator,
  linkItemValidator,
  leadershipMemberValidator,
  navLinkValidator,
  serviceIconKeyValidator,
  siteSettingKey,
} from "./lib/validators";

const contentAccessRoles = ["superAdmin", "manager", "contentEditor"] as const;

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireRole(ctx, contentAccessRoles);

    const [settings, services, destinations, blogPosts, testimonials] = await Promise.all([
      ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", siteSettingKey)).first(),
      ctx.db.query("services").collect(),
      ctx.db.query("destinations").collect(),
      ctx.db.query("blogPosts").collect(),
      ctx.db.query("testimonials").collect(),
    ]);

    return {
      siteSettings: settings,
      services: services.sort((left, right) => left.sortOrder - right.sortOrder),
      destinations: destinations.sort((left, right) => left.sortOrder - right.sortOrder),
      blogPosts: blogPosts.sort((left, right) => left.sortOrder - right.sortOrder),
      testimonials: testimonials.sort((left, right) => left.sortOrder - right.sortOrder),
    };
  },
});

export const updateSiteSettings = mutation({
  args: {
    companyInfo: companyInfoValidator,
    bookingLocations: v.array(v.string()),
    serviceTypes: v.array(v.string()),
    navLinks: v.array(navLinkValidator),
    quickLinks: v.array(linkItemValidator),
    footerServiceLinks: v.array(linkItemValidator),
    legalLinks: v.array(linkItemValidator),
    leadershipMembers: v.array(leadershipMemberValidator),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, contentAccessRoles);
    const settings = await ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", siteSettingKey)).first();

    if (!settings) {
      throw new ConvexError("Site settings have not been seeded yet.");
    }

    await ctx.db.patch(settings._id, {
      ...args,
      updatedAt: Date.now(),
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "siteSettings.updated",
      entityType: "siteSettings",
      entityId: settings._id,
      summary: "Updated company profile, navigation, and site settings.",
    });
  },
});

export const upsertService = mutation({
  args: {
    serviceId: v.optional(v.id("services")),
    slug: v.string(),
    route: v.string(),
    aliases: v.optional(v.array(v.string())),
    name: v.string(),
    menuLabel: v.string(),
    shortDescription: v.string(),
    teaser: v.string(),
    longDescription: v.string(),
    iconKey: serviceIconKeyValidator,
    heroImage: v.string(),
    idealFor: v.array(v.string()),
    inclusions: v.array(v.string()),
    featured: v.boolean(),
    hideFromMenu: v.optional(v.boolean()),
    recommendedVehicleIds: v.array(v.string()),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, contentAccessRoles);
    const now = Date.now();
    const duplicate = await ctx.db.query("services").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();

    if (duplicate && duplicate._id !== args.serviceId) {
      throw new ConvexError("A service with this slug already exists.");
    }

    if (args.serviceId) {
      const existingService = await ctx.db.get(args.serviceId);
      if (!existingService) {
        throw new ConvexError("Service not found.");
      }

      await ctx.db.patch(args.serviceId, {
        ...args,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "service.updated",
        entityType: "services",
        entityId: args.serviceId,
        summary: `Updated service ${args.name}.`,
      });

      return { serviceId: args.serviceId };
    }

    const serviceId = await ctx.db.insert("services", {
      slug: args.slug,
      route: args.route,
      aliases: args.aliases,
      name: args.name,
      menuLabel: args.menuLabel,
      shortDescription: args.shortDescription,
      teaser: args.teaser,
      longDescription: args.longDescription,
      iconKey: args.iconKey,
      heroImage: args.heroImage,
      idealFor: args.idealFor,
      inclusions: args.inclusions,
      featured: args.featured,
      hideFromMenu: args.hideFromMenu,
      recommendedVehicleIds: args.recommendedVehicleIds,
      sortOrder: args.sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "service.created",
      entityType: "services",
      entityId: serviceId,
      summary: `Created service ${args.name}.`,
    });

    return { serviceId };
  },
});

export const upsertDestination = mutation({
  args: {
    destinationId: v.optional(v.id("destinations")),
    slug: v.string(),
    route: v.string(),
    aliases: v.optional(v.array(v.string())),
    name: v.string(),
    tagline: v.string(),
    shortDescription: v.string(),
    longDescription: v.string(),
    highlights: v.array(v.string()),
    bestVehicleId: v.string(),
    serviceSlug: v.string(),
    image: v.string(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, contentAccessRoles);
    const now = Date.now();
    const duplicate = await ctx.db.query("destinations").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();

    if (duplicate && duplicate._id !== args.destinationId) {
      throw new ConvexError("A destination with this slug already exists.");
    }

    if (args.destinationId) {
      const existingDestination = await ctx.db.get(args.destinationId);
      if (!existingDestination) {
        throw new ConvexError("Destination not found.");
      }

      await ctx.db.patch(args.destinationId, {
        ...args,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "destination.updated",
        entityType: "destinations",
        entityId: args.destinationId,
        summary: `Updated destination ${args.name}.`,
      });

      return { destinationId: args.destinationId };
    }

    const destinationId = await ctx.db.insert("destinations", {
      slug: args.slug,
      route: args.route,
      aliases: args.aliases,
      name: args.name,
      tagline: args.tagline,
      shortDescription: args.shortDescription,
      longDescription: args.longDescription,
      highlights: args.highlights,
      bestVehicleId: args.bestVehicleId,
      serviceSlug: args.serviceSlug,
      image: args.image,
      sortOrder: args.sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "destination.created",
      entityType: "destinations",
      entityId: destinationId,
      summary: `Created destination ${args.name}.`,
    });

    return { destinationId };
  },
});

export const upsertBlogPost = mutation({
  args: {
    blogPostId: v.optional(v.id("blogPosts")),
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    category: v.string(),
    readingTime: v.string(),
    date: v.string(),
    image: v.string(),
    highlights: v.array(v.string()),
    sections: v.array(blogSectionValidator),
    published: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, contentAccessRoles);
    const now = Date.now();
    const duplicate = await ctx.db.query("blogPosts").withIndex("by_slug", (q) => q.eq("slug", args.slug)).first();

    if (duplicate && duplicate._id !== args.blogPostId) {
      throw new ConvexError("A blog post with this slug already exists.");
    }

    if (args.blogPostId) {
      const existingPost = await ctx.db.get(args.blogPostId);
      if (!existingPost) {
        throw new ConvexError("Blog post not found.");
      }

      await ctx.db.patch(args.blogPostId, {
        ...args,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "blogPost.updated",
        entityType: "blogPosts",
        entityId: args.blogPostId,
        summary: `Updated blog post ${args.title}.`,
      });

      return { blogPostId: args.blogPostId };
    }

    const blogPostId = await ctx.db.insert("blogPosts", {
      slug: args.slug,
      title: args.title,
      excerpt: args.excerpt,
      category: args.category,
      readingTime: args.readingTime,
      date: args.date,
      image: args.image,
      highlights: args.highlights,
      sections: args.sections,
      published: args.published,
      sortOrder: args.sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "blogPost.created",
      entityType: "blogPosts",
      entityId: blogPostId,
      summary: `Created blog post ${args.title}.`,
    });

    return { blogPostId };
  },
});

export const upsertTestimonial = mutation({
  args: {
    testimonialId: v.optional(v.id("testimonials")),
    publicId: v.string(),
    author: v.string(),
    quote: v.string(),
    summary: v.string(),
    featured: v.boolean(),
    sortOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireRole(ctx, contentAccessRoles);
    const now = Date.now();
    const duplicate = await ctx.db.query("testimonials").withIndex("by_publicId", (q) => q.eq("publicId", args.publicId)).first();

    if (duplicate && duplicate._id !== args.testimonialId) {
      throw new ConvexError("A testimonial with this ID already exists.");
    }

    if (args.testimonialId) {
      const existingTestimonial = await ctx.db.get(args.testimonialId);
      if (!existingTestimonial) {
        throw new ConvexError("Testimonial not found.");
      }

      await ctx.db.patch(args.testimonialId, {
        publicId: args.publicId,
        author: args.author,
        quote: args.quote,
        summary: args.summary,
        featured: args.featured,
        sortOrder: args.sortOrder,
        updatedAt: now,
      });

      await logActivity(ctx, {
        actorUserId: viewer._id,
        action: "testimonial.updated",
        entityType: "testimonials",
        entityId: args.testimonialId,
        summary: `Updated testimonial by ${args.author}.`,
      });

      return { testimonialId: args.testimonialId };
    }

    const testimonialId = await ctx.db.insert("testimonials", {
      publicId: args.publicId,
      author: args.author,
      quote: args.quote,
      summary: args.summary,
      featured: args.featured,
      sortOrder: args.sortOrder,
      createdAt: now,
      updatedAt: now,
    });

    await logActivity(ctx, {
      actorUserId: viewer._id,
      action: "testimonial.created",
      entityType: "testimonials",
      entityId: testimonialId,
      summary: `Created testimonial by ${args.author}.`,
    });

    return { testimonialId };
  },
});
