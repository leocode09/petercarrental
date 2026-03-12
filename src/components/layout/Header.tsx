import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { companyInfo, navLinks } from "../../data/site";
import { cn, routeIsActive } from "../../lib/utils";
import Button from "../ui/Button";
import MobileNav from "./MobileNav";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="container-shell flex h-16 items-center justify-between gap-3 sm:h-20 sm:gap-4">
          <Link className="flex min-w-0 items-center gap-2 sm:gap-3" to="/">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500 text-xl font-black text-white sm:h-12 sm:w-12 sm:rounded-2xl sm:text-2xl">
              P
            </div>
            <div className="min-w-0">
              <div className="truncate text-lg font-black leading-none text-slate-950 sm:text-xl">Peter</div>
              <div className="truncate text-[10px] font-semibold uppercase tracking-[0.28em] text-slate-400 sm:text-[11px] sm:tracking-[0.34em]">
                Car Rental
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) =>
              item.children?.length ? (
                <div className="group relative" key={item.label}>
                  <RouterNavLink
                    className={({ isActive }) =>
                      cn(
                        "inline-flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition",
                        isActive || routeIsActive(location.pathname, item.to)
                          ? "text-orange-600"
                          : "text-slate-700 hover:text-orange-600",
                      )
                    }
                    to={item.to}
                  >
                    {item.label}
                    <ChevronDown className="h-4 w-4" />
                  </RouterNavLink>

                  <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 w-72 -translate-x-1/2 rounded-3xl border border-slate-200 bg-white p-3 opacity-0 shadow-2xl shadow-slate-950/10 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="space-y-1">
                      {item.children.map((child) => (
                        <Link
                          className="block rounded-2xl px-4 py-3 transition hover:bg-slate-50"
                          key={child.to}
                          to={child.to}
                        >
                          <div className="text-sm font-semibold text-slate-900">{child.label}</div>
                          {child.description ? (
                            <div className="mt-1 text-xs leading-5 text-slate-500">{child.description}</div>
                          ) : null}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <RouterNavLink
                  className={({ isActive }) =>
                    cn(
                      "rounded-full px-4 py-2 text-sm font-semibold transition",
                      isActive ? "text-orange-600" : "text-slate-700 hover:text-orange-600",
                    )
                  }
                  key={item.label}
                  to={item.to}
                >
                  {item.label}
                </RouterNavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3">
            <Button className="hidden sm:inline-flex" to="/booking">
              Book Now
            </Button>
            <button
              aria-expanded={mobileOpen}
              aria-label="Open menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden sm:h-11 sm:w-11"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav links={navLinks} onClose={() => setMobileOpen(false)} open={mobileOpen} />
    </>
  );
}
