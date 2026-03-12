#!/usr/bin/env node

/**
 * Seeds the production Firestore database directly using the Firebase Admin SDK
 * and Application Default Credentials (set up by `firebase login`).
 *
 * Run: node scripts/seed-firestore.cjs
 *
 * This bypasses Cloud Functions, so it works without the Blaze plan.
 */

const path = require("path");
const Module = require("module");

// Add the functions node_modules to the resolution path so we can
// import firebase-admin which is only installed there.
const functionsNodeModules = path.resolve(__dirname, "..", "functions", "node_modules");
const originalPaths = Module._nodeModulePaths;
Module._nodeModulePaths = function (from) {
  const paths = originalPaths.call(this, from);
  if (!paths.includes(functionsNodeModules)) {
    paths.unshift(functionsNodeModules);
  }
  return paths;
};

const admin = require("firebase-admin");

const projectId = "peter-car-rental";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  projectId,
});

const db = admin.firestore();

const dataDir = path.resolve(__dirname, "..", "functions", "lib", "_data");
const { companyInfo, bookingLocations, serviceTypes, navLinks, quickLinks, footerServiceLinks, legalLinks } = require(path.resolve(dataDir, "site.js"));
const { leadershipMembers } = require(path.resolve(dataDir, "leadership.js"));
const { vehicles } = require(path.resolve(dataDir, "vehicles.js"));
const { services } = require(path.resolve(dataDir, "services.js"));
const { destinations } = require(path.resolve(dataDir, "destinations.js"));
const { blogPosts } = require(path.resolve(dataDir, "blog.js"));
const { testimonials } = require(path.resolve(dataDir, "testimonials.js"));

function getVehicleServiceSlugs(vehicleId) {
  return services
    .filter((s) => s.recommendedVehicleIds.includes(vehicleId))
    .map((s) => s.slug);
}

async function seed() {
  const settingsRef = db.collection("siteSettings").doc("primary");
  const existing = await settingsRef.get();
  if (existing.exists) {
    console.log("siteSettings/primary already exists - skipping seed.");
    return;
  }

  console.log("Seeding Firestore for project:", projectId);
  const now = Date.now();

  await settingsRef.set({
    key: "primary",
    companyInfo,
    bookingLocations,
    serviceTypes,
    navLinks,
    quickLinks,
    footerServiceLinks,
    legalLinks,
    leadershipMembers,
    createdAt: now,
    updatedAt: now,
  });
  console.log("  + siteSettings/primary");

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    await db.collection("vehicles").add({
      publicId: v.id,
      sortOrder: i,
      name: v.name,
      category: v.category,
      pricePerDay: v.pricePerDay,
      transmission: v.transmission,
      seats: v.seats,
      luggage: v.luggage,
      drive: v.drive,
      fuel: v.fuel,
      description: v.description,
      image: v.image,
      featured: v.featured,
      badge: v.badge,
      availabilityStatus: "available",
      serviceSlugs: getVehicleServiceSlugs(v.id),
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log("  + " + vehicles.length + " vehicles");

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await db.collection("services").add({
      ...s,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log("  + " + services.length + " services");

  for (let i = 0; i < destinations.length; i++) {
    const d = destinations[i];
    await db.collection("destinations").add({
      ...d,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log("  + " + destinations.length + " destinations");

  for (let i = 0; i < blogPosts.length; i++) {
    const p = blogPosts[i];
    await db.collection("blogPosts").add({
      ...p,
      published: true,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log("  + " + blogPosts.length + " blog posts");

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    await db.collection("testimonials").add({
      publicId: t.id,
      author: t.author,
      quote: t.quote,
      summary: t.summary,
      featured: true,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }
  console.log("  + " + testimonials.length + " testimonials");

  await db.collection("pricingRules").add({
    name: "Peak season safari uplift",
    category: "4x4 Safari",
    startDate: "2026-06-01",
    endDate: "2026-09-30",
    rateMultiplier: 1.15,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  await db.collection("pricingRules").add({
    name: "Chauffeur convenience uplift",
    serviceType: "With Chauffeur",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    rateMultiplier: 1.1,
    active: true,
    createdAt: now,
    updatedAt: now,
  });
  console.log("  + 2 pricing rules");

  await db.collection("promoCodes").add({
    code: "WELCOME10",
    description: "10% off first website booking requests.",
    discountType: "percentage",
    amount: 10,
    active: true,
    usageLimit: 200,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  await db.collection("promoCodes").add({
    code: "AIRPORT25",
    description: "Flat $25 savings for airport transfer requests.",
    discountType: "fixed",
    amount: 25,
    active: true,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  console.log("  + 2 promo codes");

  console.log("\nDone! Firestore has been seeded.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
