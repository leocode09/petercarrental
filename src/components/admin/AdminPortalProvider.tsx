import { Component, type ErrorInfo, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import FirebaseBootstrapper from "../bootstrap/FirebaseBootstrapper";
import { AuthProvider } from "../../lib/auth-context";
import Button from "../ui/Button";
import Card from "../ui/Card";

const hasFirebaseConfig = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID,
);

function AdminPortalStatusCard({
  eyebrow,
  title,
  description,
  body,
}: {
  eyebrow: string;
  title: string;
  description: ReactNode;
  body: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
      <Card className="w-full max-w-2xl p-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">{eyebrow}</p>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950">{title}</h1>
          <div className="text-sm leading-6 text-slate-600">{description}</div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">{body}</div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button to="/">Back To Website</Button>
        </div>
      </Card>
    </div>
  );
}

class AdminPortalErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = {
    error: null as Error | null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Admin portal failed to load", error, errorInfo);
  }

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    const message = error.message || "Unknown admin portal error.";

    return (
      <AdminPortalStatusCard
        body={
          <>
            <p className="font-semibold text-slate-950">Runtime error</p>
            <p className="mt-2 break-words">{message}</p>
          </>
        }
        description="The admin portal hit an unexpected runtime error."
        eyebrow="Admin Portal Error"
        title="Admin portal could not finish loading"
      />
    );
  }
}

export default function AdminPortalProvider() {
  if (!hasFirebaseConfig) {
    return (
      <AdminPortalStatusCard
        body={
          <>
            <p className="font-semibold text-slate-950">Missing environment variable</p>
            <p className="mt-2">
              Add Firebase configuration (e.g. <code>VITE_FIREBASE_API_KEY</code>,{" "}
              <code>VITE_FIREBASE_PROJECT_ID</code>) to your environment, then reload the app to enable admin login,
              setup, and dashboard features.
            </p>
          </>
        }
        description={
          <>
            Configure Firebase for this frontend. See <code>AGENTS.md</code> for setup instructions.
          </>
        }
        eyebrow="Firebase Required"
        title="Admin portal is not connected yet"
      />
    );
  }

  return (
    <AuthProvider>
      <AdminPortalErrorBoundary>
        <FirebaseBootstrapper />
        <Outlet />
      </AdminPortalErrorBoundary>
    </AuthProvider>
  );
}
