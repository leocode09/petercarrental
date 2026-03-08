import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export async function submitLead(args: { name: string; email: string; message: string }) {
  const normalized = {
    name: args.name.trim(),
    email: args.email.trim().toLowerCase(),
    message: args.message.trim(),
  };
  if (!normalized.name || !normalized.email || !normalized.message) {
    throw new Error("Name, email, and message are required.");
  }
  const now = Date.now();
  const ref = await addDoc(collection(db, "contactLeads"), {
    ...normalized,
    status: "new",
    createdAt: now,
    updatedAt: now,
  });
  return { id: ref.id };
}

export async function submitComplaint(args: {
  name: string;
  contactInfo: string;
  details: string;
}) {
  const normalized = {
    name: args.name.trim(),
    contactInfo: args.contactInfo.trim(),
    details: args.details.trim(),
  };
  if (!normalized.name || !normalized.contactInfo || !normalized.details) {
    throw new Error("Name, contact info, and complaint details are required.");
  }
  const ref = await addDoc(collection(db, "complaints"), {
    ...normalized,
    createdAt: Date.now(),
  });
  return { id: ref.id };
}

export async function subscribeNewsletter(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!normalized) {
    throw new Error("Email is required.");
  }
  const ref = await addDoc(collection(db, "newsletterSubscribers"), {
    email: normalized,
    createdAt: Date.now(),
  });
  return { id: ref.id };
}
