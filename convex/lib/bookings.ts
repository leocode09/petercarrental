import type { Doc } from "../_generated/dataModel";

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeCode(code: string) {
  return code.trim().toUpperCase();
}

export function generateBookingReference() {
  const stamp = Date.now().toString(36).slice(-6).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `PCR-${stamp}${random}`;
}

function dateToUtcStamp(date: string) {
  return new Date(`${date}T00:00:00Z`).getTime();
}

export function calculateBookingDays(pickupDate: string, returnDate: string) {
  const pickupStamp = dateToUtcStamp(pickupDate);
  const returnStamp = dateToUtcStamp(returnDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = Math.round((returnStamp - pickupStamp) / dayMs);
  return Math.max(1, diff);
}

export function dateRangeOverlaps(
  leftStart: string,
  leftEnd: string,
  rightStart: string,
  rightEnd: string,
) {
  const leftStartStamp = dateToUtcStamp(leftStart);
  const leftEndStamp = dateToUtcStamp(leftEnd);
  const rightStartStamp = dateToUtcStamp(rightStart);
  const rightEndStamp = dateToUtcStamp(rightEnd);

  return leftStartStamp < rightEndStamp && rightStartStamp < leftEndStamp;
}

export function isBookingBlockingAvailability(status: Doc<"bookings">["status"]) {
  return ["new", "confirmed", "change_requested", "in_progress"].includes(status);
}

export function isPromoActive(promoCode: Doc<"promoCodes"> | null, now = Date.now()) {
  if (!promoCode || !promoCode.active) {
    return false;
  }

  if (promoCode.startsAt && promoCode.startsAt > now) {
    return false;
  }

  if (promoCode.endsAt && promoCode.endsAt < now) {
    return false;
  }

  if (promoCode.usageLimit !== undefined && promoCode.usedCount >= promoCode.usageLimit) {
    return false;
  }

  return true;
}

export function applyDiscount(total: number, promoCode: Doc<"promoCodes"> | null) {
  if (!promoCode) {
    return {
      discountedTotal: total,
      discountAmount: 0,
      promoApplied: false,
    };
  }

  const discountAmount =
    promoCode.discountType === "percentage"
      ? Math.round(total * (promoCode.amount / 100))
      : promoCode.amount;

  return {
    discountedTotal: Math.max(0, total - discountAmount),
    discountAmount: Math.min(total, discountAmount),
    promoApplied: true,
  };
}

export function matchesVehicleService(vehicle: Doc<"vehicles">, serviceType: string) {
  if (serviceType === "Self-Drive") {
    return vehicle.category !== "Luxury";
  }

  if (serviceType === "With Chauffeur") {
    return vehicle.category !== "4x4 Safari" || vehicle.serviceSlugs.includes("safari");
  }

  return true;
}
