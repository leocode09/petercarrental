import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Outlet } from "react-router-dom";
import ConvexBootstrapper from "../bootstrap/ConvexBootstrapper";
import Button from "../ui/Button";
import Card from "../ui/Card";

const convexUrl = import.meta.env.VITE_CONVEX_URL;
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

export default function AdminPortalProvider() {
  if (!convex) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-10">
        <Card className="w-full max-w-2xl p-8">
          <div className="space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Admin Backend Required</p>
            <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950">Admin portal is not connected yet</h1>
            <p className="text-sm leading-6 text-slate-600">
              Configure <code>VITE_CONVEX_URL</code> for this frontend and start or deploy the Convex backend before signing in.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-950">Missing environment variable</p>
            <p className="mt-2">
              Add a valid Convex deployment URL to <code>VITE_CONVEX_URL</code>, then reload the app to enable admin login,
              setup, and dashboard features.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button to="/">Back To Website</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <ConvexAuthProvider client={convex}>
      <ConvexBootstrapper />
      <Outlet />
    </ConvexAuthProvider>
  );
}
