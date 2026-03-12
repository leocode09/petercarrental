import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export type PublicBookingInput = {
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
  airportTransfer: boolean;
  notes?: string;
};

export type PublicBookingResult = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  returnDate: string;
  pickupTime: string;
  vehicleCategory: string;
  selectedVehicleId?: string;
  serviceType: string;
  airportTransfer: boolean;
  notes?: string;
  status: string;
  updatedAt: number;
};

export async function submitPublicBooking(
  input: PublicBookingInput
): Promise<{ bookingId: string; reference: string }> {
  const fn = httpsCallable<
    PublicBookingInput,
    { bookingId: string; reference: string }
  >(functions, "submitPublicBooking");
  const res = await fn(input);
  return res.data;
}

export async function lookupPublicBooking(args: {
  reference?: string;
  email?: string;
}): Promise<{ found: boolean; booking: PublicBookingResult | null }> {
  const fn = httpsCallable<
    { reference?: string; email?: string },
    { found: boolean; booking: PublicBookingResult | null }
  >(functions, "lookupPublicBooking");
  const res = await fn(args);
  return res.data;
}

export async function updatePublicBooking(input: PublicBookingInput & {
  reference: string;
}): Promise<{ updated: boolean; reference: string }> {
  const fn = httpsCallable<
    PublicBookingInput & { reference: string },
    { updated: boolean; reference: string }
  >(functions, "updatePublicBooking");
  const res = await fn(input);
  return res.data;
}
