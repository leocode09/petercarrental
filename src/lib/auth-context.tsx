import { createContext, useContext, useMemo, type ReactNode } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";
import type { UserRole } from "./validators";

export type AdminUser = {
  _id: string;
  authUserId: string;
  email: string | null;
  image?: string | null;
  name: string | null;
  role: UserRole | null;
};

const staticAdmin: AdminUser = {
  _id: "admin",
  authUserId: "admin",
  email: "admin@petercarrental.rw",
  name: "Admin",
  role: "superAdmin",
};

type AuthContextValue = {
  user: object | null;
  loading: boolean;
  role: UserRole | null;
  adminUser: AdminUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextValue>({
  user: staticAdmin,
  loading: false,
  role: "superAdmin",
  adminUser: staticAdmin,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: staticAdmin,
        loading: false,
        role: "superAdmin",
        adminUser: staticAdmin,
        signIn: async () => {},
        signOut: async () => {},
        isAdmin: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useCallable<TReq, TRes>(name: string) {
  return useMemo(() => {
    return httpsCallable<TReq, TRes>(functions, name);
  }, [name]);
}
