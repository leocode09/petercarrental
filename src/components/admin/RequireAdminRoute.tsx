import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { api } from "../../../convex/_generated/api";

export default function RequireAdminRoute() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const viewer = useQuery(api.adminUsers.currentAdmin, isAuthenticated ? {} : "skip");

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
          Your account is signed in but does not have an admin role yet.
        </div>
      </div>
    );
  }

  return <Outlet />;
}
