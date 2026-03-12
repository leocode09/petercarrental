import { useEffect, useRef } from "react";
import { doc, getDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../../lib/firebase";
import { siteSettingKey } from "../../lib/validators";

export default function FirebaseBootstrapper() {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }

    let cancelled = false;

    async function checkAndSeed() {
      try {
        const settingsRef = await getDoc(doc(db, "siteSettings", siteSettingKey));
        if (settingsRef.exists()) {
          return;
        }

        attemptedRef.current = true;
        if (cancelled) return;

        const functions = getFunctions();
        const seedFn = httpsCallable(functions, "seedPublicData");
        await seedFn();
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
