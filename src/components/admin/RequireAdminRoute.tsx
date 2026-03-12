import { Outlet } from "react-router-dom";

/** Bypasses admin auth - anyone can access /admin without logging in. */
export default function RequireAdminRoute() {
  return <Outlet />;
}
