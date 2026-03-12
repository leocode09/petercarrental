import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export async function submitLead(args: { name: string; email: string; message: string }) {
  const fn = httpsCallable<
    { name: string; email: string; message: string },
    { id: string }
  >(functions, "submitContactLead");
  const res = await fn(args);
  return { id: res.data.id };
}

export async function submitComplaint(args: {
  name: string;
  contactInfo: string;
  details: string;
  bookingReference?: string;
}) {
  const fn = httpsCallable<
    { name: string; contactInfo: string; details: string; bookingReference?: string },
    { id: string }
  >(functions, "submitComplaintPublic");
  const res = await fn(args);
  return { id: res.data.id };
}

export async function subscribeNewsletter(email: string) {
  const fn = httpsCallable<
    { email: string },
    { id: string; alreadySubscribed: boolean }
  >(functions, "subscribeNewsletterPublic");
  const res = await fn({ email });
  return { id: res.data.id, alreadySubscribed: res.data.alreadySubscribed };
}
