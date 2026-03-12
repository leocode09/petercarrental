import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { Outlet } from "react-router-dom";
import ConvexBootstrapper from "../bootstrap/ConvexBootstrapper";
import Button from "../ui/Button";
import Card from "../ui/Card";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

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
    const backendNotDeployed =
      message.includes("Could not find public function") ||
      message.includes("Did you forget to run `npx convex dev` or `npx convex deploy`?");

    if (backendNotDeployed) {
      return (
        <AdminPortalStatusCard
          body={
            <>
              <p className="font-semibold text-slate-950">Convex backend found, but app functions are missing</p>
              <p className="mt-2">
                Sign into the Convex CLI and deploy this repo to the selected deployment with <code>npx convex dev</code> or{" "}
                <code>npx convex deploy</code>. You can also use a <code>CONVEX_DEPLOY_KEY</code> for non-interactive deploys.
              </p>
            </>
          }
          description={
            <>
              The frontend is connected to <code>VITE_CONVEX_URL</code>, but the deployment does not have this app's Convex
              functions yet.
            </>
          }
          eyebrow="Backend Deployment Required"
          title="Admin portal backend is not deployed yet"
        />
      );
    }

    return (
      <AdminPortalStatusCard
        body={
          <>
            <p className="font-semibold text-slate-950">Runtime error</p>
            <p className="mt-2 break-words">{message}</p>
          </>
        }
        description="The admin portal hit an unexpected runtime error after connecting to Convex."
        eyebrow="Admin Portal Error"
        title="Admin portal could not finish loading"
      />
    );
  }
}

export default function AdminPortalProvider() {
  if (!convex) {
    return (
      <AdminPortalStatusCard
        body={
          <>
            <p className="font-semibold text-slate-950">Missing environment variable</p>
            <p className="mt-2">
              Add a valid Convex deployment URL to <code>VITE_CONVEX_URL</code>, then reload the app to enable admin login,
              setup, and dashboard features.
            </p>
          </>
        }
        description={
          <>
            Configure <code>VITE_CONVEX_URL</code> for this frontend and start or deploy the Convex backend before signing in.
          </>
        }
        eyebrow="Admin Backend Required"
        title="Admin portal is not connected yet"
      />
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      <AdminPortalErrorBoundary>
        <ConvexBootstrapper />
        <Outlet />
      </AdminPortalErrorBoundary>
    </ConvexAuthProvider>
  );
}
