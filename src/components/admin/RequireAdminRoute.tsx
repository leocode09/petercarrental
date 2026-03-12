import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../../../convex/_generated/api";

export default function RequireAdminRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.adminUsers.currentAdmin, isAuthenticated ? {} : "skip");
  const bootstrapFirstAdminRole = useMutation(api.adminUsers.bootstrapFirstAdminRole);
  const [bootstrapError, setBootstrapError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !viewer || viewer.role) {
      return;
    }

    let cancelled = false;

    void bootstrapFirstAdminRole()
      .then(() => {
        if (!cancelled) {
          setBootstrapError("");
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setBootstrapError(
            error instanceof Error
              ? error.message
              : "Your account is signed in but does not have an admin role yet.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bootstrapFirstAdminRole, isAuthenticated, viewer]);

  if (isLoading || (isAuthenticated && viewer === undefined)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="surface-card rounded-[28px] px-6 py-5 text-sm text-slate-600">Checking admin access...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />;
  }

  if (!viewer?.role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="surface-card max-w-md rounded-[28px] p-6 text-sm leading-6 text-slate-600">
          {bootstrapError || "Finishing admin access setup..."}
        </div>
      </div>
    );
  }

  return <Outlet />;
}
