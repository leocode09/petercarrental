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
          "container-shell relative z-10 grid gap-5 py-14 sm:gap-6 sm:py-16 md:py-20",
          compact
            ? "min-h-[280px] place-items-start content-center sm:min-h-[320px] md:min-h-[340px]"
            : "min-h-[320px] place-items-start content-center sm:min-h-[380px] md:min-h-[420px]",
        )}
      >
        {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
        <div className="max-w-3xl space-y-5">
          <h1 className="page-section-title text-white">{title}</h1>
          <p className="max-w-2xl text-sm leading-6 text-slate-200 sm:text-base sm:leading-7 md:text-lg">
            {description}
          </p>
        </div>
        {children ? (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center [&>*]:w-full sm:[&>*]:w-auto">
            {children}
          </div>
        ) : null}
      </div>
    </section>
  );
}
