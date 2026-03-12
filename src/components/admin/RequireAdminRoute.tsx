import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/auth-context";

export default function RequireAdminRoute() {
  const location = useLocation();
  const { user, loading, adminUser } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="surface-card rounded-[28px] px-6 py-5 text-sm text-slate-600">Checking admin access...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate replace state={{ from: location.pathname }} to="/admin/login" />;
  }

  if (!adminUser?.role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="surface-card max-w-md rounded-[28px] p-6 text-sm leading-6 text-slate-600">
          Your account does not have admin access. Please contact an administrator.
        </div>
      </div>
    );
  }

  return <Outlet />;
}
