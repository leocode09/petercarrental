import { useEffect, useRef } from "react";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { siteSettingKey } from "../../lib/validators";

import {
  companyInfo,
  bookingLocations,
  serviceTypes,
  navLinks,
  quickLinks,
  footerServiceLinks,
  legalLinks,
} from "../../data/site";
import { leadershipMembers } from "../../data/leadership";
import { vehicles } from "../../data/vehicles";
import { services } from "../../data/services";
import { destinations } from "../../data/destinations";
import { blogPosts } from "../../data/blog";
import { testimonials } from "../../data/testimonials";

function getVehicleServiceSlugs(vehicleId: string) {
  return services
    .filter((s) => s.recommendedVehicleIds.includes(vehicleId))
    .map((s) => s.slug);
}

export default function FirebaseBootstrapper() {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) return;

    let cancelled = false;

    async function checkAndSeed() {
      try {
        const snap = await getDoc(doc(db, "siteSettings", siteSettingKey));
        if (snap.exists()) return;

        attemptedRef.current = true;
        if (cancelled) return;

        console.log("[seed] siteSettings not found — seeding Firestore…");
        const now = Date.now();

        await setDoc(doc(db, "siteSettings", siteSettingKey), {
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

        const col = (name: string) => collection(db, name);

        for (let i = 0; i < vehicles.length; i++) {
          const v = vehicles[i];
          await addDoc(col("vehicles"), {
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
          await addDoc(col("services"), {
            ...s,
            sortOrder: i,
            createdAt: now,
            updatedAt: now,
          });
        }

        for (let i = 0; i < destinations.length; i++) {
          const d = destinations[i];
          await addDoc(col("destinations"), {
            ...d,
            sortOrder: i,
            createdAt: now,
            updatedAt: now,
          });
        }

        for (let i = 0; i < blogPosts.length; i++) {
          const p = blogPosts[i];
          await addDoc(col("blogPosts"), {
            ...p,
            published: true,
            sortOrder: i,
            createdAt: now,
            updatedAt: now,
          });
        }

        for (let i = 0; i < testimonials.length; i++) {
          const t = testimonials[i];
          await addDoc(col("testimonials"), {
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

        await addDoc(col("pricingRules"), {
          name: "Peak season safari uplift",
          category: "4x4 Safari",
          startDate: "2026-06-01",
          endDate: "2026-09-30",
          rateMultiplier: 1.15,
          active: true,
          createdAt: now,
          updatedAt: now,
        });
        await addDoc(col("pricingRules"), {
          name: "Chauffeur convenience uplift",
          serviceType: "With Chauffeur",
          startDate: "2026-01-01",
          endDate: "2026-12-31",
          rateMultiplier: 1.1,
          active: true,
          createdAt: now,
          updatedAt: now,
        });

        await addDoc(col("promoCodes"), {
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
        await addDoc(col("promoCodes"), {
          code: "AIRPORT25",
          description: "Flat $25 savings for airport transfer requests.",
          discountType: "fixed",
          amount: 25,
          active: true,
          usedCount: 0,
          createdAt: now,
          updatedAt: now,
        });

        console.log("[seed] Firestore seeded successfully.");
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to seed Firestore content", error);
        }
      }
    }

    void checkAndSeed();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
