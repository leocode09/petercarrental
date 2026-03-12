import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "./auth-context";
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
