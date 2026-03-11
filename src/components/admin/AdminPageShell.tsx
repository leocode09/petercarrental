import type { ReactNode } from "react";

export default function AdminPageShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">Admin Portal</p>
          <h1 className="text-3xl font-black tracking-[-0.03em] text-slate-950">{title}</h1>
          <p className="max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>

      {children}
    </section>
  );
}
