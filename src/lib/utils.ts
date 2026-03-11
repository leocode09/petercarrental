import { companyInfo } from "../data/site";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPricePerDay(value: number) {
  return `${formatCurrency(value)}/day`;
}

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${companyInfo.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  if (typeof window !== "undefined") {
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  }
}

export const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100";

export const textareaClassName = `${inputClassName} min-h-36 resize-y`;

export function routeIsActive(currentPath: string, targetPath: string) {
  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath || currentPath.startsWith(`${targetPath}/`);
}
