export default function AdminMetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="surface-card rounded-[28px] p-6">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <div className="mt-3 text-3xl font-black tracking-[-0.03em] text-slate-950">{value}</div>
      {hint ? <p className="mt-2 text-sm leading-6 text-slate-500">{hint}</p> : null}
    </div>
  );
}
