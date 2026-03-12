"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePublicBooking = exports.lookupPublicBooking = exports.submitPublicBooking = exports.setAdminRole = exports.createAdminUser = exports.seedPublicData = exports.listAdminUsers = exports.checkHasAnyAdmin = exports.loginAdmin = exports.createFirstAdmin = void 0;
const crypto = require("crypto");
const admin = require("firebase-admin");
const https_1 = require("firebase-functions/v2/https");
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();
const PBKDF2_ITERATIONS = 310000;
const SALT_BYTES = 32;
const HASH_BYTES = 64;
// Allow CORS from localhost and production for callable functions
const callableOptions = { cors: true };
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function hashPassword(password, salt) {
    const saltBuf = salt ?? crypto.randomBytes(SALT_BYTES);
    const hash = crypto.pbkdf2Sync(password, saltBuf, PBKDF2_ITERATIONS, HASH_BYTES, "sha256");
    return {
        hash: hash.toString("base64"),
        salt: saltBuf.toString("base64"),
    };
}
function verifyPassword(password, saltBase64, hashBase64) {
    const salt = Buffer.from(saltBase64, "base64");
    const expected = Buffer.from(hashBase64, "base64");
    const actual = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, HASH_BYTES, "sha256");
    return crypto.timingSafeEqual(expected, actual);
}
/** Creates the first super admin. Firestore-only; no Firebase Auth. */
exports.createFirstAdmin = (0, https_1.onCall)(callableOptions, async (request) => {
    const { name, email, password } = request.data ?? {};
    if (!name || !email || !password) {
        throw new https_1.HttpsError("invalid-argument", "Name, email, and password are required.");
    }
    if (password.length < 8) {
        throw new https_1.HttpsError("invalid-argument", "Password must be at least 8 characters.");
    }
    const normalizedEmail = normalizeEmail(email);
    const adminsSnap = await db.collection("admins").limit(1).get();
    if (!adminsSnap.empty) {
        throw new https_1.HttpsError("failed-precondition", "An admin account already exists.");
    }
    const { hash, salt } = hashPassword(password);
    const ref = await db.collection("admins").add({
        email: normalizedEmail,
        name,
        role: "superAdmin",
        passwordHash: hash,
        salt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { userId: ref.id };
});
/** Login with email/password. Verifies against Firestore and returns custom token. */
exports.loginAdmin = (0, https_1.onCall)(callableOptions, async (request) => {
    const { email, password } = request.data ?? {};
    if (!email || !password) {
        throw new https_1.HttpsError("invalid-argument", "Email and password are required.");
    }
    const normalizedEmail = normalizeEmail(email);
    const adminsSnap = await db.collection("admins").where("email", "==", normalizedEmail).limit(1).get();
    if (adminsSnap.empty) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email or password.");
    }
    const doc = adminsSnap.docs[0];
    const data = doc.data();
    const passwordHash = data.passwordHash;
    const salt = data.salt;
    if (!passwordHash || !salt) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email or password.");
    }
    if (!verifyPassword(password, salt, passwordHash)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid email or password.");
    }
    const role = data.role ?? "contentEditor";
    const token = await auth.createCustomToken(doc.id, {
        role,
        email: normalizedEmail,
        name: data.name ?? "",
    });
    return { token };
});
/** Returns whether any admin exists. Used to decide if setup page should be shown. */
exports.checkHasAnyAdmin = (0, https_1.onCall)(callableOptions, async () => {
    const adminsSnap = await db.collection("admins").limit(1).get();
    return { hasAnyAdmin: !adminsSnap.empty };
});
/** Lists admin users. Requires caller to be superAdmin or manager. */
exports.listAdminUsers = (0, https_1.onCall)(callableOptions, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in.");
    }
    const role = request.auth.token.role;
    if (!["superAdmin", "manager"].includes(role ?? "")) {
        throw new https_1.HttpsError("permission-denied", "You do not have permission to list admin users.");
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
exports.seedPublicData = (0, https_1.onCall)(callableOptions, async () => {
    const settingsRef = db.collection("siteSettings").doc("primary");
    const existing = await settingsRef.get();
    if (existing.exists) {
        return { seeded: false, reason: "already-seeded" };
    }
    const now = Date.now();
    // Import static data (copied to functions/src/_data by scripts/copy-seed-data.js)
    const { companyInfo, bookingLocations, serviceTypes, navLinks, quickLinks, footerServiceLinks, legalLinks } = await Promise.resolve().then(() => require("./_data/site.js"));
    const { leadershipMembers } = await Promise.resolve().then(() => require("./_data/leadership.js"));
    const { vehicles } = await Promise.resolve().then(() => require("./_data/vehicles.js"));
    const { services } = await Promise.resolve().then(() => require("./_data/services.js"));
    const { destinations } = await Promise.resolve().then(() => require("./_data/destinations.js"));
    const { blogPosts } = await Promise.resolve().then(() => require("./_data/blog.js"));
    const { testimonials } = await Promise.resolve().then(() => require("./_data/testimonials.js"));
    function getVehicleServiceSlugs(vehicleId) {
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
/** Creates an admin user. Requires caller to be superAdmin or manager. Firestore-only. */
exports.createAdminUser = (0, https_1.onCall)(callableOptions, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in.");
    }
    const callerRole = request.auth.token.role;
    if (!["superAdmin", "manager"].includes(callerRole ?? "")) {
        throw new https_1.HttpsError("permission-denied", "You do not have permission to create admin users.");
    }
    const { name, email, password, role } = request.data ?? {};
    if (!name || !email || !password || !role) {
        throw new https_1.HttpsError("invalid-argument", "Name, email, password, and role are required.");
    }
    if (!["superAdmin", "manager", "operations", "contentEditor"].includes(role)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid role.");
    }
    if (password.length < 8) {
        throw new https_1.HttpsError("invalid-argument", "Password must be at least 8 characters.");
    }
    const normalizedEmail = normalizeEmail(email);
    const existing = await db.collection("admins").where("email", "==", normalizedEmail).limit(1).get();
    if (!existing.empty) {
        throw new https_1.HttpsError("already-exists", "An admin with this email already exists.");
    }
    const { hash, salt } = hashPassword(password);
    const ref = await db.collection("admins").add({
        email: normalizedEmail,
        name,
        role,
        passwordHash: hash,
        salt,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { userId: ref.id };
});
/** Updates another user's role. superAdmin only. Firestore-only. */
exports.setAdminRole = (0, https_1.onCall)(callableOptions, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "You must be signed in.");
    }
    if (request.auth.token.role !== "superAdmin") {
        throw new https_1.HttpsError("permission-denied", "Only super admins can update roles.");
    }
    const { userId, role } = request.data ?? {};
    if (!userId || !role) {
        throw new https_1.HttpsError("invalid-argument", "userId and role are required.");
    }
    if (!["superAdmin", "manager", "operations", "contentEditor"].includes(role)) {
        throw new https_1.HttpsError("invalid-argument", "Invalid role.");
    }
    const callerUid = request.auth.uid;
    if (userId === callerUid && role !== "superAdmin") {
        throw new https_1.HttpsError("invalid-argument", "You cannot remove your own super admin access.");
    }
    const adminRef = db.collection("admins").doc(userId);
    const snap = await adminRef.get();
    if (snap.exists) {
        await adminRef.update({ role, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    }
    else {
        throw new https_1.HttpsError("not-found", "Admin user not found.");
    }
});
// --- Public booking (unauthenticated) ---
function generateBookingReference() {
    const stamp = Date.now().toString(36).slice(-6).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `PCR-${stamp}${random}`;
}
exports.submitPublicBooking = (0, https_1.onCall)(callableOptions, async (request) => {
    const data = request.data ?? {};
    const { fullName, email, phone, pickupLocation, dropoffLocation, pickupDate, returnDate, pickupTime, vehicleCategory, selectedVehicleId, serviceType, promoCode, airportTransfer, notes, } = data;
    if (!fullName ||
        !email ||
        !pickupLocation ||
        !dropoffLocation ||
        !pickupDate ||
        !returnDate ||
        !pickupTime ||
        !vehicleCategory ||
        !serviceType ||
        typeof airportTransfer !== "boolean") {
        throw new https_1.HttpsError("invalid-argument", "Missing required booking fields.");
    }
    const normalizedEmail = normalizeEmail(email);
    const now = Date.now();
    let customerId;
    const custSnap = await db.collection("customers").where("email", "==", normalizedEmail).limit(1).get();
    if (!custSnap.empty) {
        customerId = custSnap.docs[0].id;
        await db.collection("customers").doc(customerId).update({
            fullName: fullName.trim(),
            phone: phone?.trim() || null,
            updatedAt: now,
        });
    }
    else {
        const custRef = await db.collection("customers").add({
            email: normalizedEmail,
            fullName: fullName.trim(),
            phone: phone?.trim() || null,
            type: "individual",
            tags: [],
            createdAt: now,
            updatedAt: now,
        });
        customerId = custRef.id;
    }
    const reference = generateBookingReference();
    const bookingRef = await db.collection("bookings").add({
        reference,
        customerId,
        fullName: fullName.trim(),
        email: normalizedEmail,
        phone: phone?.trim() || null,
        pickupLocation: pickupLocation.trim(),
        dropoffLocation: dropoffLocation.trim(),
        pickupDate,
        returnDate,
        pickupTime,
        vehicleCategory,
        selectedVehicleId: selectedVehicleId?.trim() || null,
        serviceType,
        promoCode: promoCode?.trim() || null,
        promoCodeApplied: null,
        airportTransfer,
        notes: notes?.trim() || null,
        source: "public",
        status: "new",
        createdAt: now,
        updatedAt: now,
    });
    return { bookingId: bookingRef.id, reference };
});
exports.lookupPublicBooking = (0, https_1.onCall)(callableOptions, async (request) => {
    const { reference, email } = request.data ?? {};
    const refNorm = reference?.trim().toUpperCase();
    const emailNorm = email?.trim().toLowerCase();
    if (!refNorm && !emailNorm) {
        throw new https_1.HttpsError("invalid-argument", "Reference or email is required.");
    }
    let query = db.collection("bookings");
    if (refNorm) {
        query = query.where("reference", "==", refNorm);
    }
    if (emailNorm) {
        query = query.where("email", "==", emailNorm);
    }
    const snap = await query.limit(2).get();
    if (snap.empty) {
        return { found: false, booking: null };
    }
    const doc = snap.docs[0];
    const d = doc.data();
    if (refNorm && d.reference.toUpperCase() !== refNorm) {
        return { found: false, booking: null };
    }
    if (emailNorm && d.email.toLowerCase() !== emailNorm) {
        return { found: false, booking: null };
    }
    return {
        found: true,
        booking: {
            id: doc.id,
            reference: d.reference,
            fullName: d.fullName,
            email: d.email,
            pickupLocation: d.pickupLocation,
            dropoffLocation: d.dropoffLocation,
            pickupDate: d.pickupDate,
            returnDate: d.returnDate,
            pickupTime: d.pickupTime,
            vehicleCategory: d.vehicleCategory,
            selectedVehicleId: d.selectedVehicleId,
            serviceType: d.serviceType,
            airportTransfer: d.airportTransfer,
            notes: d.notes,
            status: d.status,
            updatedAt: typeof d.updatedAt === "object" && d.updatedAt && "toMillis" in d.updatedAt
                ? d.updatedAt.toMillis()
                : d.updatedAt,
        },
    };
});
exports.updatePublicBooking = (0, https_1.onCall)(callableOptions, async (request) => {
    const data = request.data ?? {};
    const reference = data.reference?.trim().toUpperCase();
    if (!reference) {
        throw new https_1.HttpsError("invalid-argument", "Reference is required for updates.");
    }
    const snap = await db.collection("bookings").where("reference", "==", reference).limit(1).get();
    if (snap.empty) {
        throw new https_1.HttpsError("not-found", "Booking not found.");
    }
    const docRef = snap.docs[0].ref;
    const existing = snap.docs[0].data();
    const existingEmail = existing.email?.toLowerCase();
    const providedEmail = normalizeEmail(data.email ?? "");
    if (existingEmail !== providedEmail) {
        throw new https_1.HttpsError("permission-denied", "Email does not match the booking.");
    }
    const now = Date.now();
    await docRef.update({
        fullName: data.fullName?.trim() ?? existing.fullName,
        email: providedEmail,
        phone: data.phone?.trim() || null,
        pickupLocation: data.pickupLocation?.trim() ?? existing.pickupLocation,
        dropoffLocation: data.dropoffLocation?.trim() ?? existing.dropoffLocation,
        pickupDate: data.pickupDate ?? existing.pickupDate,
        returnDate: data.returnDate ?? existing.returnDate,
        pickupTime: data.pickupTime ?? existing.pickupTime,
        vehicleCategory: data.vehicleCategory ?? existing.vehicleCategory,
        selectedVehicleId: data.selectedVehicleId?.trim() || null,
        serviceType: data.serviceType ?? existing.serviceType,
        promoCode: data.promoCode?.trim() || null,
        airportTransfer: typeof data.airportTransfer === "boolean" ? data.airportTransfer : existing.airportTransfer,
        notes: data.notes?.trim() || null,
        status: "change_requested",
        updatedAt: now,
    });
    return { updated: true, reference };
});
//# sourceMappingURL=index.js.map