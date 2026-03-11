import type { SelectHTMLAttributes } from "react";
import { cn, inputClassName } from "../../lib/utils";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  hint?: string;
}

export default function Select({ label, options, className, hint, id, ...props }: SelectProps) {
  const fieldId = id ?? props.name;

  return (
    <label className="flex flex-col gap-2">
      {label ? <span className="text-sm font-semibold text-slate-700">{label}</span> : null}
      <select className={cn(inputClassName, className)} id={fieldId} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}
