import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onIdTokenChanged, signInWithCustomToken, signOut, type User } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth, default as app } from "./firebase";
import type { UserRole } from "./validators";

export type AdminUser = {
  _id: string;
  authUserId: string;
  email: string | null;
  image?: string | null;
  name: string | null;
  role: UserRole | null;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  role: UserRole | null;
  adminUser: AdminUser | null;
};

const initialState: AuthState = {
  user: null,
  loading: true,
  role: null,
  adminUser: null,
};

const AuthContext = createContext<AuthState & {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}>({
  ...initialState,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        setState({ user: null, loading: false, role: null, adminUser: null });
        return;
      }

      const tokenResult = await user.getIdTokenResult();
      const role = (tokenResult.claims.role as UserRole) ?? null;
      const claims = tokenResult.claims as Record<string, unknown>;
      const email = (claims.email as string) ?? user.email ?? null;
      const name = (claims.name as string) ?? user.displayName ?? null;

      setState({
        user,
        loading: false,
        role,
        adminUser: {
          _id: user.uid,
          authUserId: user.uid,
          email,
          image: user.photoURL ?? null,
          name,
          role,
        },
      });
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const functions = getFunctions(app, "us-central1");
    const loginFn = httpsCallable<{ email: string; password: string }, { token: string }>(functions, "loginAdmin");
    const res = await loginFn({ email: email.trim().toLowerCase(), password });
    const token = res.data.token;
    if (!token) throw new Error("No token returned");
    await signInWithCustomToken(auth, token);
  }, []);

  const signOutUser = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut: signOutUser,
        isAdmin: state.role != null,
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
    // Use explicit app and us-central1 region to match Firebase Functions deployment
    const functions = getFunctions(app, "us-central1");
    return httpsCallable<TReq, TRes>(functions, name);
  }, [name]);
}
