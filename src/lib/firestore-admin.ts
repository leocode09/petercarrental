import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { AvailabilityStatus, BookingStatus } from "./validators";

function generateBookingReference() {
  const stamp = Date.now().toString(36).slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PCR-${stamp}${random}`;
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

// Fleet
export type VehicleDoc = {
  id: string;
  publicId: string;
  sortOrder: number;
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
  availabilityStatus: AvailabilityStatus;
  maintenanceNotes?: string;
  serviceSlugs: string[];
};

export async function listFleet(): Promise<VehicleDoc[]> {
  const snap = await getDocs(
    query(collection(db, "vehicles"), orderBy("sortOrder", "asc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as VehicleDoc));
}

export async function upsertVehicle(
  viewerId: string,
  args: {
    vehicleId?: string;
    publicId: string;
    sortOrder: number;
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
    availabilityStatus: AvailabilityStatus;
    maintenanceNotes?: string;
    serviceSlugs: string[];
  }
) {
  const now = Date.now();

  if (args.vehicleId) {
    const ref = doc(db, "vehicles", args.vehicleId);
    const existing = await getDoc(ref);
    if (!existing.exists()) throw new Error("Vehicle not found.");

    const dupSnap = await getDocs(
      query(
        collection(db, "vehicles"),
        where("publicId", "==", args.publicId)
      )
    );
    const duplicate = dupSnap.docs.find((d) => d.id !== args.vehicleId);
    if (duplicate) throw new Error("A vehicle with this public ID already exists.");

    await updateDoc(ref, {
      publicId: args.publicId,
      sortOrder: args.sortOrder,
      name: args.name,
      category: args.category,
      pricePerDay: args.pricePerDay,
      transmission: args.transmission,
      seats: args.seats,
      luggage: args.luggage,
      drive: args.drive,
      fuel: args.fuel,
      description: args.description,
      image: args.image,
      featured: args.featured,
      badge: args.badge ?? null,
      availabilityStatus: args.availabilityStatus,
      maintenanceNotes: args.maintenanceNotes ?? null,
      serviceSlugs: args.serviceSlugs,
      updatedAt: now,
    });

    await addDoc(collection(db, "activityLogs"), {
      actorUserId: viewerId,
      action: "vehicle.updated",
      entityType: "vehicles",
      entityId: args.vehicleId,
      summary: `Updated vehicle ${args.name}.`,
      createdAt: now,
    });

    return { vehicleId: args.vehicleId };
  }

  const dupSnap = await getDocs(
    query(collection(db, "vehicles"), where("publicId", "==", args.publicId))
  );
  if (!dupSnap.empty) throw new Error("A vehicle with this public ID already exists.");

  const ref = await addDoc(collection(db, "vehicles"), {
    publicId: args.publicId,
    sortOrder: args.sortOrder,
    name: args.name,
    category: args.category,
    pricePerDay: args.pricePerDay,
    transmission: args.transmission,
    seats: args.seats,
    luggage: args.luggage,
    drive: args.drive,
    fuel: args.fuel,
    description: args.description,
    image: args.image,
    featured: args.featured,
    badge: args.badge ?? null,
    availabilityStatus: args.availabilityStatus,
    maintenanceNotes: args.maintenanceNotes ?? null,
    serviceSlugs: args.serviceSlugs,
    createdAt: now,
    updatedAt: now,
  });

  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "vehicle.created",
    entityType: "vehicles",
    entityId: ref.id,
    summary: `Created vehicle ${args.name}.`,
    createdAt: now,
  });

  return { vehicleId: ref.id };
}

// Bookings
export type BookingDoc = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone?: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  vehicleCategory: string;
  selectedVehicleId?: string;
  serviceType: string;
  promoCode?: string;
  promoCodeApplied?: boolean;
  airportTransfer: boolean;
  notes?: string;
  source: string;
  status: BookingStatus;
  totalEstimate?: number;
  pricingRuleLabel?: string;
  adminNotes?: string;
  updatedAt: number;
};

export async function listBookings(): Promise<BookingDoc[]> {
  const snap = await getDocs(
    query(collection(db, "bookings"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => {
    const data = d.data();
    return { id: d.id, ...data, updatedAt: (data.updatedAt as { toMillis?: () => number })?.toMillis?.() ?? data.updatedAt } as BookingDoc;
  });
}

export async function upsertBooking(
  viewerId: string,
  args: {
    bookingId?: string;
    reference?: string;
    fullName: string;
    email: string;
    phone?: string;
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    returnDate: string;
    pickupTime: string;
    vehicleCategory: string;
    selectedVehicleId?: string;
    serviceType: string;
    promoCode?: string;
    promoCodeApplied?: boolean;
    airportTransfer: boolean;
    notes?: string;
    source: string;
    status: BookingStatus;
    totalEstimate?: number;
    pricingRuleLabel?: string;
    adminNotes?: string;
  }
) {
  const email = normalizeEmail(args.email);
  const now = Date.now();

  let customerId: string;
  const custSnap = await getDocs(
    query(collection(db, "customers"), where("email", "==", email))
  );
  const existingCust = custSnap.docs[0];

  if (existingCust) {
    customerId = existingCust.id;
    await updateDoc(doc(db, "customers", customerId), {
      fullName: args.fullName,
      phone: args.phone ?? null,
      updatedAt: now,
    });
  } else {
    const custRef = await addDoc(collection(db, "customers"), {
      email,
      fullName: args.fullName,
      phone: args.phone ?? null,
      type: "individual",
      tags: [],
      createdAt: now,
      updatedAt: now,
    });
    customerId = custRef.id;
  }

  if (args.bookingId) {
    const ref = doc(db, "bookings", args.bookingId);
    const existing = await getDoc(ref);
    if (!existing.exists()) throw new Error("Booking not found.");
    const prev = existing.data();

    await updateDoc(ref, {
      customerId,
      fullName: args.fullName,
      email,
      phone: args.phone ?? null,
      pickupLocation: args.pickupLocation,
      dropoffLocation: args.dropoffLocation,
      pickupDate: args.pickupDate,
      returnDate: args.returnDate,
      pickupTime: args.pickupTime,
      vehicleCategory: args.vehicleCategory,
      selectedVehicleId: args.selectedVehicleId ?? null,
      serviceType: args.serviceType,
      promoCode: args.promoCode ?? null,
      promoCodeApplied: args.promoCodeApplied ?? null,
      airportTransfer: args.airportTransfer,
      notes: args.notes ?? null,
      source: args.source,
      status: args.status,
      totalEstimate: args.totalEstimate ?? null,
      pricingRuleLabel: args.pricingRuleLabel ?? null,
      adminNotes: args.adminNotes ?? null,
      updatedAt: now,
    });

    await addDoc(collection(db, "activityLogs"), {
      actorUserId: viewerId,
      action: "booking.updated",
      entityType: "bookings",
      entityId: args.bookingId,
      summary: `Updated booking ${args.reference ?? prev.reference}.`,
      createdAt: now,
    });

    return { bookingId: args.bookingId, reference: args.reference ?? (prev.reference as string) };
  }

  const reference = args.reference?.trim() || generateBookingReference();
  const ref = await addDoc(collection(db, "bookings"), {
    reference,
    customerId,
    fullName: args.fullName,
    email,
    phone: args.phone ?? null,
    pickupLocation: args.pickupLocation,
    dropoffLocation: args.dropoffLocation,
    pickupDate: args.pickupDate,
    returnDate: args.returnDate,
    pickupTime: args.pickupTime,
    vehicleCategory: args.vehicleCategory,
    selectedVehicleId: args.selectedVehicleId ?? null,
    serviceType: args.serviceType,
    promoCode: args.promoCode ?? null,
    promoCodeApplied: args.promoCodeApplied ?? null,
    airportTransfer: args.airportTransfer,
    notes: args.notes ?? null,
    source: args.source,
    status: args.status,
    totalEstimate: args.totalEstimate ?? null,
    pricingRuleLabel: args.pricingRuleLabel ?? null,
    adminNotes: args.adminNotes ?? null,
    createdAt: now,
    updatedAt: now,
  });

  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "booking.created",
    entityType: "bookings",
    entityId: ref.id,
    summary: `Created booking ${reference}.`,
    createdAt: now,
  });

  return { bookingId: ref.id, reference };
}

// Customers
export type CustomerDoc = {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  type: "individual" | "corporate" | "vip";
  tags: string[];
  notes?: string;
};

export async function listCustomers(): Promise<CustomerDoc[]> {
  const snap = await getDocs(
    query(collection(db, "customers"), orderBy("updatedAt", "desc"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerDoc));
}

export async function updateCustomer(
  viewerId: string,
  args: {
    customerId: string;
    fullName: string;
    phone?: string;
    type: "individual" | "corporate" | "vip";
    tags: string[];
    notes?: string;
  }
) {
  const ref = doc(db, "customers", args.customerId);
  const existing = await getDoc(ref);
  if (!existing.exists()) throw new Error("Customer not found.");

  const now = Date.now();
  await updateDoc(ref, {
    fullName: args.fullName,
    phone: args.phone ?? null,
    type: args.type,
    tags: args.tags,
    notes: args.notes ?? null,
    updatedAt: now,
  });

  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "customer.updated",
    entityType: "customers",
    entityId: args.customerId,
    summary: `Updated customer ${args.fullName}.`,
    createdAt: now,
  });
}

// Pricing
export type PricingRuleDoc = {
  id: string;
  name: string;
  category?: string;
  serviceType?: string;
  startDate: string;
  endDate: string;
  rateMultiplier: number;
  active: boolean;
};

export type PromoCodeDoc = {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  amount: number;
  active: boolean;
  startsAt?: number;
  endsAt?: number;
  usageLimit?: number;
  usedCount: number;
};

export async function listPricing(): Promise<{
  pricingRules: PricingRuleDoc[];
  promoCodes: PromoCodeDoc[];
}> {
  const [rulesSnap, promosSnap] = await Promise.all([
    getDocs(query(collection(db, "pricingRules"), orderBy("updatedAt", "desc"))),
    getDocs(query(collection(db, "promoCodes"), orderBy("updatedAt", "desc"))),
  ]);
  return {
    pricingRules: rulesSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PricingRuleDoc)),
    promoCodes: promosSnap.docs.map((d) => ({ id: d.id, ...d.data() } as PromoCodeDoc)),
  };
}

function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export async function upsertPricingRule(
  viewerId: string,
  args: {
    pricingRuleId?: string;
    name: string;
    category?: string;
    serviceType?: string;
    startDate: string;
    endDate: string;
    rateMultiplier: number;
    active: boolean;
  }
) {
  const now = Date.now();

  if (args.pricingRuleId) {
    const ref = doc(db, "pricingRules", args.pricingRuleId);
    const existing = await getDoc(ref);
    if (!existing.exists()) throw new Error("Pricing rule not found.");

    await updateDoc(ref, { ...args, updatedAt: now });
    await addDoc(collection(db, "activityLogs"), {
      actorUserId: viewerId,
      action: "pricingRule.updated",
      entityType: "pricingRules",
      entityId: args.pricingRuleId,
      summary: `Updated pricing rule ${args.name}.`,
      createdAt: now,
    });
    return { pricingRuleId: args.pricingRuleId };
  }

  const ref = await addDoc(collection(db, "pricingRules"), {
    ...args,
    createdAt: now,
    updatedAt: now,
  });
  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "pricingRule.created",
    entityType: "pricingRules",
    entityId: ref.id,
    summary: `Created pricing rule ${args.name}.`,
    createdAt: now,
  });
  return { pricingRuleId: ref.id };
}

export async function upsertPromoCode(
  viewerId: string,
  args: {
    promoCodeId?: string;
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    amount: number;
    active: boolean;
    startsAt?: number;
    endsAt?: number;
    usageLimit?: number;
  }
) {
  const code = normalizeCode(args.code);
  const now = Date.now();

  const dupSnap = await getDocs(
    query(collection(db, "promoCodes"), where("code", "==", code))
  );
  const duplicate = dupSnap.docs.find((d) => d.id !== args.promoCodeId);
  if (duplicate) throw new Error("A promo code with this code already exists.");

  if (args.promoCodeId) {
    const ref = doc(db, "promoCodes", args.promoCodeId);
    const existing = await getDoc(ref);
    if (!existing.exists()) throw new Error("Promo code not found.");

    await updateDoc(ref, {
      code,
      description: args.description,
      discountType: args.discountType,
      amount: args.amount,
      active: args.active,
      startsAt: args.startsAt ?? null,
      endsAt: args.endsAt ?? null,
      usageLimit: args.usageLimit ?? null,
      updatedAt: now,
    });
    await addDoc(collection(db, "activityLogs"), {
      actorUserId: viewerId,
      action: "promoCode.updated",
      entityType: "promoCodes",
      entityId: args.promoCodeId,
      summary: `Updated promo code ${code}.`,
      createdAt: now,
    });
    return { promoCodeId: args.promoCodeId };
  }

  const ref = await addDoc(collection(db, "promoCodes"), {
    code,
    description: args.description,
    discountType: args.discountType,
    amount: args.amount,
    active: args.active,
    startsAt: args.startsAt ?? null,
    endsAt: args.endsAt ?? null,
    usageLimit: args.usageLimit ?? null,
    usedCount: 0,
    createdAt: now,
    updatedAt: now,
  });
  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "promoCode.created",
    entityType: "promoCodes",
    entityId: ref.id,
    summary: `Created promo code ${code}.`,
    createdAt: now,
  });
  return { promoCodeId: ref.id };
}

// Inbox
export type LeadDoc = { id: string; name: string; email: string; message: string; status: string };
export type ComplaintDoc = {
  id: string;
  name: string;
  contactInfo: string;
  details: string;
  bookingReference?: string;
  status: string;
};
export type NewsletterDoc = { id: string; email: string; updatedAt: number };

export async function listInbox(): Promise<{
  leads: LeadDoc[];
  complaints: ComplaintDoc[];
  newsletterSubscribers: NewsletterDoc[];
}> {
  const [leadsSnap, complaintsSnap, newsletterSnap] = await Promise.all([
    getDocs(query(collection(db, "contactLeads"), orderBy("updatedAt", "desc"))),
    getDocs(query(collection(db, "complaints"), orderBy("updatedAt", "desc"))),
    getDocs(query(collection(db, "newsletterSubscribers"), orderBy("updatedAt", "desc"))),
  ]);

  const toNum = (v: unknown) => (typeof v === "object" && v !== null && "toMillis" in v ? (v as { toMillis: () => number }).toMillis() : (v as number));

  return {
    leads: leadsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as LeadDoc)),
    complaints: complaintsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as ComplaintDoc)),
    newsletterSubscribers: newsletterSnap.docs.map((d) => {
      const data = d.data();
      return { id: d.id, email: data.email, updatedAt: toNum(data.updatedAt) } as NewsletterDoc;
    }),
  };
}

export async function updateLeadStatus(
  viewerId: string,
  leadId: string,
  status: "new" | "in_progress" | "resolved"
) {
  const now = Date.now();
  await updateDoc(doc(db, "contactLeads", leadId), { status, updatedAt: now });
  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "lead.updated",
    entityType: "contactLeads",
    entityId: leadId,
    summary: `Updated lead status to ${status}.`,
    createdAt: now,
  });
}

// Dashboard overview
export async function getDashboardOverview() {
  const [bookingsSnap, vehiclesSnap, complaintsSnap, leadsSnap, activitySnap] = await Promise.all([
    getDocs(collection(db, "bookings")),
    getDocs(collection(db, "vehicles")),
    getDocs(collection(db, "complaints")),
    getDocs(collection(db, "contactLeads")),
    getDocs(
      query(collection(db, "activityLogs"), orderBy("createdAt", "desc"))
    ),
  ]);

  const bookings = bookingsSnap.docs.map((d) => d.data() as { status: string; pickupDate: string; returnDate: string; selectedVehicleId?: string; reference: string; fullName: string; pickupTime: string; pickupLocation: string; dropoffLocation: string });
  const vehicles = vehiclesSnap.docs.map((d) => d.data());
  const complaints = complaintsSnap.docs.map((d) => d.data() as { status: string });
  const leads = leadsSnap.docs.map((d) => d.data() as { status: string });
  const activityLogs = activitySnap.docs.map((d) => ({ id: d.id, ...d.data() }));

  const activeBookings = bookings.filter((b) =>
    ["new", "confirmed", "change_requested", "in_progress"].includes(b.status)
  );
  const unresolvedComplaints = complaints.filter((c) =>
    ["new", "investigating"].includes(c.status)
  );
  const openLeads = leads.filter((l) => l.status !== "resolved");
  const upcomingPickups = [...bookings]
    .sort((a, b) => a.pickupDate.localeCompare(b.pickupDate))
    .slice(0, 5);
  const nextReturns = [...bookings]
    .sort((a, b) => a.returnDate.localeCompare(b.returnDate))
    .slice(0, 5);
  const revenueSnapshot = bookings.reduce((total, b) => {
    if (["cancelled", "refunded"].includes(b.status)) return total;
    return total + ((b as { totalEstimate?: number }).totalEstimate ?? 0);
  }, 0);
  const utilizedVehicleIds = new Set(
    activeBookings
      .map((b) => b.selectedVehicleId)
      .filter(Boolean)
  );
  const recentActivity = activityLogs.slice(0, 8);

  return {
    metrics: {
      activeBookings: activeBookings.length,
      upcomingPickups: upcomingPickups.length,
      nextReturns: nextReturns.length,
      fleetUtilizationRate:
        vehicles.length === 0
          ? 0
          : Math.round((utilizedVehicleIds.size / vehicles.length) * 100),
      unresolvedComplaints: unresolvedComplaints.length,
      openLeads: openLeads.length,
      revenueSnapshot,
    },
    upcomingPickups,
    nextReturns,
    recentActivity,
  };
}

// Reports summary
export async function getReportsSummary() {
  const [bookingsSnap, vehiclesSnap, leadsSnap, complaintsSnap] = await Promise.all([
    getDocs(collection(db, "bookings")),
    getDocs(collection(db, "vehicles")),
    getDocs(collection(db, "contactLeads")),
    getDocs(collection(db, "complaints")),
  ]);

  const bookings = bookingsSnap.docs.map((d) => d.data());
  const vehicles = vehiclesSnap.docs.map((d) => d.data() as { publicId: string; name: string });
  const leads = leadsSnap.docs.map((d) => d.data() as { status: string });
  const complaints = complaintsSnap.docs.map((d) => d.data() as { status: string });

  const bookingsByStatus = Object.entries(
    (bookings as { status: string }[]).reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));

  const bookingsBySource = Object.entries(
    (bookings as { source: string }[]).reduce<Record<string, number>>((acc, b) => {
      acc[b.source] = (acc[b.source] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([source, count]) => ({ source, count }));

  const bookingsByCategory = Object.entries(
    (bookings as { vehicleCategory: string }[]).reduce<Record<string, number>>((acc, b) => {
      acc[b.vehicleCategory] = (acc[b.vehicleCategory] ?? 0) + 1;
      return acc;
    }, {})
  ).map(([category, count]) => ({ category, count }));

  const vehiclePerformance = vehicles.map((v) => ({
    vehicleId: v.publicId,
    vehicleName: v.name,
    bookings: (bookings as { selectedVehicleId?: string }[]).filter((b) => b.selectedVehicleId === v.publicId).length,
  })).sort((a, b) => b.bookings - a.bookings);

  return {
    bookingsByStatus,
    bookingsBySource,
    bookingsByCategory,
    vehiclePerformance,
    leadCount: leads.length,
    complaintCount: complaints.length,
    resolvedLeadCount: leads.filter((l) => l.status === "resolved").length,
    resolvedComplaintCount: complaints.filter((c) => ["resolved", "closed"].includes(c.status)).length,
  };
}

export async function updateComplaintStatus(
  viewerId: string,
  complaintId: string,
  status: "new" | "investigating" | "resolved" | "closed"
) {
  const now = Date.now();
  await updateDoc(doc(db, "complaints", complaintId), { status, updatedAt: now });
  await addDoc(collection(db, "activityLogs"), {
    actorUserId: viewerId,
    action: "complaint.updated",
    entityType: "complaints",
    entityId: complaintId,
    summary: `Updated complaint status to ${status}.`,
    createdAt: now,
  });
}
