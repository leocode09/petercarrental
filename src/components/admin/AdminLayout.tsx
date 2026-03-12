import {
  BarChart3,
  BookOpen,
  CarFront,
  ClipboardList,
  Inbox,
  LayoutDashboard,
  MapPin,
  Megaphone,
  MessageSquareQuote,
  Settings,
  Shield,
  Users,
  WalletCards,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
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

export default function AdminLayout() {
  const { companyInfo } = usePublicSiteData();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-slate-950 px-6 py-8 text-slate-200 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black text-white">
              P
            </div>
            <div>
              <div className="text-xl font-black text-white">{companyInfo?.name ?? "Peter Car Rental"}</div>
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
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500">Operations, content, and reporting</p>
                <h1 className="text-lg font-black text-slate-950">Peter Car Rental Admin</h1>
              </div>
              <Button to="/" variant="outline">
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
