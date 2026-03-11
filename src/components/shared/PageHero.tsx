import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description: string;
  image?: string;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  children,
  className,
  compact = false,
}: PageHeroProps) {
  return (
    <section className={cn("page-hero", className)}>
      {image ? (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(180deg, rgba(2, 6, 23, 0.62), rgba(2, 6, 23, 0.86)), url(${image})` }}
        />
      ) : null}

      <div
        className={cn(
          "container-shell relative z-10 grid gap-6 py-20 md:py-24",
          compact ? "min-h-[340px] place-items-start content-center" : "min-h-[420px] place-items-start content-center",
        )}
      >
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <div className="max-w-3xl space-y-5">
          <h1 className="page-section-title text-white">{title}</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-200 md:text-lg">{description}</p>
        </div>
        {children ? <div className="flex flex-wrap items-center gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
