import { useEffect, useRef } from "react";
import { getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { siteSettingKey } from "../../lib/validators";
import { seedPublicData } from "../../lib/firestore-seed";

export default function FirebaseBootstrapper() {
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (attemptedRef.current) {
      return;
    }

    let cancelled = false;

    async function checkAndSeed() {
      try {
        const settingsRef = await getDoc(db.collection("siteSettings").doc(siteSettingKey));
        if (settingsRef.exists()) {
          return;
        }

        attemptedRef.current = true;
        if (cancelled) return;

        await seedPublicData();
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
