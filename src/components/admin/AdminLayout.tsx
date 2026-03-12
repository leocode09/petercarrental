import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CarFront,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  MapPin,
  Menu,
  Megaphone,
  MessageSquareQuote,
  Settings,
  Shield,
  Users,
  WalletCards,
  X,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";
import { usePublicSiteData } from "../../lib/publicData";
import Button from "../ui/Button";

const navigationItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/fleet", label: "Fleet", icon: CarFront },
  { to: "/admin/reservations", label: "Reservations", icon: ClipboardList },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/pricing", label: "Pricing", icon: WalletCards },
  { to: "/admin/services", label: "Services", icon: Megaphone },
  { to: "/admin/destinations", label: "Destinations", icon: MapPin },
  { to: "/admin/blog", label: "Blog", icon: BookOpen },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/site-settings", label: "Site Settings", icon: Settings },
  { to: "/admin/inbox", label: "Inbox", icon: Inbox },
  { to: "/admin/users", label: "Users & Roles", icon: Shield },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

function SidebarContent({ companyName }: { companyName: string }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black text-white">
          P
        </div>
        <div>
          <div className="text-xl font-black text-white">{companyName}</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">Admin Portal</div>
        </div>
      </div>

      <nav className="mt-8 flex-1 space-y-1">
        {navigationItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                isActive ? "bg-white text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white",
              )
            }
            end={to === "/admin"}
            key={to}
            to={to}
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <Button to="/" variant="outline">
        Back To Website
      </Button>
    </>
  );
}

export default function AdminLayout() {
  const { companyInfo } = usePublicSiteData();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const companyName = companyInfo?.name ?? "Peter Car Rental";

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        {/* Desktop sidebar */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 px-6 py-8 text-slate-200 lg:flex lg:flex-col">
          <SidebarContent companyName={companyName} />
        </aside>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileOpen(false)}
              onKeyDown={(e) => { if (e.key === "Escape") setMobileOpen(false); }}
              role="button"
              tabIndex={-1}
            />
            <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-slate-950 px-6 py-8 text-slate-200 shadow-2xl">
              <button
                className="absolute right-4 top-4 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent companyName={companyName} />
            </aside>
          </div>
        )}

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-50 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                  type="button"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <div className="lg:hidden">
                  <h1 className="text-lg font-black leading-tight text-slate-950">{companyName} Admin</h1>
                </div>
              </div>
              <Button className="shrink-0" size="sm" to="/" variant="outline">
                View Website
              </Button>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
