import { useEffect, useState } from "react";
import { useAuth, useCallable } from "./auth-context";
import type { AdminUser } from "./auth-context";

type AuthState = {
  hasAnyAdmin: boolean;
  viewer: AdminUser | null;
  loading: boolean;
};

export function useAuthState(): AuthState {
  const { user, adminUser, loading: authLoading } = useAuth();
  const checkHasAnyAdmin = useCallable<void, { data: { hasAnyAdmin: boolean } }>("checkHasAnyAdmin");
  const [hasAnyAdmin, setHasAnyAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;

    checkHasAnyAdmin()
      .then((res) => {
        if (!cancelled && res.data) {
          setHasAnyAdmin((res.data as { hasAnyAdmin: boolean }).hasAnyAdmin);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHasAnyAdmin(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [checkHasAnyAdmin]);

  const loading = authLoading || hasAnyAdmin === null;

  return {
    hasAnyAdmin: hasAnyAdmin ?? false,
    viewer: adminUser ?? null,
    loading,
  };
}
