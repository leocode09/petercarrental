import { ChevronRight, X } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavLink } from "../../data/site";
import { cn } from "../../lib/utils";
import Button from "../ui/Button";

interface MobileNavProps {
  open: boolean;
  links: NavLink[];
  onClose: () => void;
}

export default function MobileNav({ open, links, onClose }: MobileNavProps) {
  if (!open) {
    return null;
  }

  return (
    <div className={cn("fixed inset-0 z-50 bg-slate-950/50 transition", open ? "opacity-100" : "opacity-0")}>
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-lg font-bold text-slate-950">Peter Car Rental</p>
            <p className="text-sm text-slate-500">Premium travel across Rwanda</p>
          </div>
          <button
            aria-label="Close menu"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700"
            onClick={onClose}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          <div className="space-y-4">
            {links.map((link) => (
              <div className="rounded-3xl border border-slate-200 p-4" key={link.label}>
                <Link
                  className="flex items-center justify-between gap-3 text-base font-semibold text-slate-950"
                  onClick={onClose}
                  to={link.to}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </Link>

                {link.children?.length ? (
                  <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
                    {link.children.map((child) => (
                      <Link
                        className="block rounded-2xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-orange-600"
                        key={child.to}
                        onClick={onClose}
                        to={child.to}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-200 p-5">
          <Button fullWidth onClick={onClose} to="/booking">
            Book Now
          </Button>
        </div>
      </div>
    </div>
  );
}
