import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function ConvexBootstrapper() {
  const seedStatus = useQuery(api.bootstrap.getSeedStatus, {});
  const seedPublicData = useMutation(api.bootstrap.seedPublicData);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!seedStatus || seedStatus.seeded || attemptedRef.current) {
      return;
    }

    attemptedRef.current = true;
    void seedPublicData().catch((error) => {
      attemptedRef.current = false;
      console.error("Failed to seed Convex content", error);
    });
  }, [seedPublicData, seedStatus]);

  return null;
}
