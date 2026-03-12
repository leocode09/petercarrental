import { createContext, useContext, type ReactNode } from "react";
import FirebaseBootstrapper from "../bootstrap/FirebaseBootstrapper";
import {
  usePublicSiteData,
  type PublicSiteData,
} from "../../lib/firestore-public";

const PublicDataContext = createContext<{
  data: PublicSiteData | null;
  loading: boolean;
} | null>(null);

export function usePublicData() {
  const ctx = useContext(PublicDataContext);
  if (!ctx) {
    throw new Error("usePublicData must be used within PublicDataProvider");
  }
  return ctx;
}

export default function PublicDataProvider({ children }: { children: ReactNode }) {
  const { data, loading } = usePublicSiteData();

  return (
    <PublicDataContext.Provider value={{ data, loading }}>
      <FirebaseBootstrapper />
      {children}
    </PublicDataContext.Provider>
  );
}
