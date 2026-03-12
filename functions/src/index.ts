import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";

admin.initializeApp();

const db = admin.firestore();
const auth = admin.auth();

type UserRole = "superAdmin" | "manager" | "operations" | "contentEditor";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Creates the first super admin. No auth required; protected by "no existing admin" check. */
export const createFirstAdmin = onCall<{
  name: string;
  email: string;
  password: string;
}>(async (request) => {
  const { name, email, password } = request.data ?? {};

  if (!name || !email || !password) {
    throw new HttpsError("invalid-argument", "Name, email, and password are required.");
  }

  if (password.length < 8) {
    throw new HttpsError("invalid-argument", "Password must be at least 8 characters.");
  }

  const normalizedEmail = normalizeEmail(email);

  // Check if any admin exists (admins collection or users with role claim)
  const adminsSnap = await db.collection("admins").limit(1).get();
  if (!adminsSnap.empty) {
    throw new HttpsError("failed-precondition", "An admin account already exists.");
  }

  // List users and check for role claim (Firebase Auth doesn't have a built-in "list by claim")
  // We use admins collection as source of truth for "hasAnyAdmin"
  // If admins is empty, we're good to create the first one

  let user: admin.auth.UserRecord;

  try {
    user = await auth.createUser({
      email: normalizedEmail,
      password,
      displayName: name,
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.message?.includes("already exists")) {
      // User exists but may not be admin - grant superAdmin
      const existing = await auth.getUserByEmail(normalizedEmail);
      user = existing;
    } else {
      const message = err instanceof Error ? err.message : "Unable to create the admin account.";
      throw new HttpsError("internal", message);
    }
  }

  await auth.setCustomUserClaims(user.uid, { role: "superAdmin" });
  await db.collection("admins").doc(user.uid).set({
    email: normalizedEmail,
    name,
    role: "superAdmin",
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return { userId: user.uid };
});

/** Returns whether any admin exists. Used to decide if setup page should be shown. */
export const checkHasAnyAdmin = onCall<void>(async () => {
  const adminsSnap = await db.collection("admins").limit(1).get();
  return { hasAnyAdmin: !adminsSnap.empty };
});

/** Lists admin users. Requires caller to be superAdmin or manager. */
export const listAdminUsers = onCall<void>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }

  const role = request.auth.token.role as string | undefined;
  if (!["superAdmin", "manager"].includes(role ?? "")) {
    throw new HttpsError("permission-denied", "You do not have permission to list admin users.");
  }

  const adminsSnap = await db.collection("admins").get();
  const users = adminsSnap.docs.map((d) => {
    const data = d.data();
    return {
      _id: d.id,
      email: data.email,
      name: data.name,
      role: data.role,
    };
  });

  return { users };
});

/** Seeds public site data when siteSettings/primary does not exist. */
export const seedPublicData = onCall<void>(async () => {
  const settingsRef = db.collection("siteSettings").doc("primary");
  const existing = await settingsRef.get();
  if (existing.exists) {
    return { seeded: false, reason: "already-seeded" };
  }

  const now = Date.now();

  // Import static data (copied to functions/src/_data by scripts/copy-seed-data.js)
  const { companyInfo, bookingLocations, serviceTypes, navLinks, quickLinks, footerServiceLinks, legalLinks } = await import("./_data/site.js");
  const { leadershipMembers } = await import("./_data/leadership.js");
  const { vehicles } = await import("./_data/vehicles.js");
  const { services } = await import("./_data/services.js");
  const { destinations } = await import("./_data/destinations.js");
  const { blogPosts } = await import("./_data/blog.js");
  const { testimonials } = await import("./_data/testimonials.js");

  function getVehicleServiceSlugs(vehicleId: string) {
    return services
      .filter((s) => s.recommendedVehicleIds.includes(vehicleId))
      .map((s) => s.slug);
  }

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

  for (let i = 0; i < services.length; i++) {
    const s = services[i];
    await db.collection("services").add({
      ...s,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }

  for (let i = 0; i < destinations.length; i++) {
    const d = destinations[i];
    await db.collection("destinations").add({
      ...d,
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    });
  }

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

  return { seeded: true, reason: "seeded" };
});

/** Creates an admin user. Requires caller to be superAdmin or manager. */
export const createAdminUser = onCall<{
  name: string;
  email: string;
  password: string;
  role: UserRole;
}>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }

  const callerRole = request.auth.token.role as string | undefined;
  if (!["superAdmin", "manager"].includes(callerRole ?? "")) {
    throw new HttpsError("permission-denied", "You do not have permission to create admin users.");
  }

  const { name, email, password, role } = request.data ?? {};

  if (!name || !email || !password || !role) {
    throw new HttpsError("invalid-argument", "Name, email, password, and role are required.");
  }

  if (!["superAdmin", "manager", "operations", "contentEditor"].includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid role.");
  }

  if (password.length < 8) {
    throw new HttpsError("invalid-argument", "Password must be at least 8 characters.");
  }

  const normalizedEmail = normalizeEmail(email);

  try {
    const user = await auth.createUser({
      email: normalizedEmail,
      password,
      displayName: name,
    });

    await auth.setCustomUserClaims(user.uid, { role });
    await db.collection("admins").doc(user.uid).set({
      email: normalizedEmail,
      name,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { userId: user.uid };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to create the admin account.";
    if (message.toLowerCase().includes("already exists")) {
      throw new HttpsError("already-exists", "An admin with this email already exists.");
    }
    throw new HttpsError("internal", message);
  }
});

/** Updates another user's role. superAdmin only. */
export const setAdminRole = onCall<{
  userId: string;
  role: UserRole;
}>(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You must be signed in.");
  }

  if (request.auth.token.role !== "superAdmin") {
    throw new HttpsError("permission-denied", "Only super admins can update roles.");
  }

  const { userId, role } = request.data ?? {};

  if (!userId || !role) {
    throw new HttpsError("invalid-argument", "userId and role are required.");
  }

  if (!["superAdmin", "manager", "operations", "contentEditor"].includes(role)) {
    throw new HttpsError("invalid-argument", "Invalid role.");
  }

  const callerUid = request.auth.uid;
  if (userId === callerUid && role !== "superAdmin") {
    throw new HttpsError("invalid-argument", "You cannot remove your own super admin access.");
  }

  try {
    await auth.setCustomUserClaims(userId, { role });
    const adminRef = db.collection("admins").doc(userId);
    const snap = await adminRef.get();
    if (snap.exists) {
      await adminRef.update({ role, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    } else {
      await adminRef.set({ role, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unable to update role.";
    throw new HttpsError("internal", message);
  }
});
