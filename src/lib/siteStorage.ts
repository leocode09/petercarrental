interface StorageEntity {
  createdAt: string;
  updatedAt: string;
}

export interface StoredBooking extends StorageEntity {
  reference: string;
  fullName: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  vehicleCategory: string;
  serviceType: string;
  selectedVehicleId: string;
  promoCode: string;
  airportTransfer: boolean;
  notes: string;
  status: "Pending confirmation" | "Updated locally";
}

export interface NewsletterSubscriber extends StorageEntity {
  email: string;
}

interface StoredPayload {
  bookings: StoredBooking[];
  newsletter: NewsletterSubscriber[];
}

const STORAGE_KEY = "peter-car-rental-site-data";

const defaultPayload: StoredPayload = {
  bookings: [],
  newsletter: [],
};

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function readPayload() {
  if (!canUseBrowserStorage()) {
    return defaultPayload;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return defaultPayload;
    }

    const parsedValue = JSON.parse(storedValue) as Partial<StoredPayload>;

    return {
      bookings: Array.isArray(parsedValue.bookings) ? parsedValue.bookings : [],
      newsletter: Array.isArray(parsedValue.newsletter) ? parsedValue.newsletter : [],
    };
  } catch {
    return defaultPayload;
  }
}

function writePayload(payload: StoredPayload) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function buildReference() {
  const stamp = Date.now().toString(36).slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `PCR-${stamp}${random}`;
}

export function getStoredBookings() {
  return [...readPayload().bookings].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

export function findStoredBooking(reference?: string | null, contactValue?: string | null) {
  const normalizedReference = reference?.trim().toUpperCase();
  const normalizedContact = contactValue?.trim().toLowerCase();

  return (
    getStoredBookings().find((booking) => {
      const matchesReference = normalizedReference
        ? booking.reference.toUpperCase() === normalizedReference
        : true;
      const matchesContact = normalizedContact
        ? booking.email.trim().toLowerCase() === normalizedContact
        : true;

      return matchesReference && matchesContact;
    }) ?? null
  );
}

export function saveBooking(
  booking: Omit<StoredBooking, "createdAt" | "updatedAt" | "reference" | "status"> & {
    reference?: string;
  },
) {
  const payload = readPayload();
  const existingBookingIndex = booking.reference
    ? payload.bookings.findIndex(
        (storedBooking) => storedBooking.reference.toUpperCase() === booking.reference?.trim().toUpperCase(),
      )
    : -1;
  const now = new Date().toISOString();

  if (existingBookingIndex >= 0) {
    const existingBooking = payload.bookings[existingBookingIndex];
    const updatedBooking: StoredBooking = {
      ...existingBooking,
      ...booking,
      reference: existingBooking.reference,
      createdAt: existingBooking.createdAt,
      updatedAt: now,
      status: "Updated locally",
    };

    payload.bookings[existingBookingIndex] = updatedBooking;
    writePayload(payload);

    return updatedBooking;
  }

  const createdBooking: StoredBooking = {
    ...booking,
    reference: buildReference(),
    createdAt: now,
    updatedAt: now,
    status: "Pending confirmation",
  };

  payload.bookings = [createdBooking, ...payload.bookings];
  writePayload(payload);

  return createdBooking;
}

export function buildBookingQueryString(booking: StoredBooking) {
  const params = new URLSearchParams({
    reference: booking.reference,
    fullName: booking.fullName,
    email: booking.email,
    pickupLocation: booking.pickupLocation,
    dropoffLocation: booking.dropoffLocation,
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
    pickupTime: booking.pickupTime,
    category: booking.vehicleCategory,
    serviceType: booking.serviceType,
    notes: booking.notes,
  });

  if (booking.selectedVehicleId) {
    params.set("vehicle", booking.selectedVehicleId);
  }

  if (booking.promoCode) {
    params.set("promoCode", booking.promoCode);
  }

  if (booking.airportTransfer) {
    params.set("airport", "true");
  }

  return params.toString();
}

export function saveNewsletterSignup(email: string) {
  const payload = readPayload();
  const normalizedEmail = email.trim().toLowerCase();
  const existingSubscriber = payload.newsletter.find(
    (subscriber) => subscriber.email.trim().toLowerCase() === normalizedEmail,
  );
  const now = new Date().toISOString();

  if (existingSubscriber) {
    existingSubscriber.updatedAt = now;
    writePayload(payload);

    return { subscriber: existingSubscriber, created: false };
  }

  const newSubscriber: NewsletterSubscriber = {
    email: normalizedEmail,
    createdAt: now,
    updatedAt: now,
  };

  payload.newsletter = [newSubscriber, ...payload.newsletter];
  writePayload(payload);

  return { subscriber: newSubscriber, created: true };
}
