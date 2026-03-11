import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "whatsapp" | "light";
type Size = "sm" | "md" | "lg";

interface BaseProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    to?: never;
    href?: never;
  };

type LinkProps = BaseProps & {
  to: string;
  href?: never;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

type AnchorProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    to?: never;
  };

export type AppButtonProps = ButtonProps | LinkProps | AnchorProps;

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600",
  secondary:
    "bg-slate-950 text-white shadow-lg shadow-slate-950/20 hover:bg-slate-800",
  outline:
    "border border-slate-300 bg-white text-slate-900 hover:border-orange-300 hover:text-orange-600",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950",
  whatsapp:
    "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600",
  light:
    "border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white hover:text-slate-950",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

function getButtonClassName({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: BaseProps) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:pointer-events-none disabled:opacity-60",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );
}

export default function Button(props: AppButtonProps) {
  const className = getButtonClassName(props);

  if ("to" in props && props.to) {
    const { children, to, className: _className, variant, size, fullWidth, ...rest } = props;

    return (
      <Link className={className} to={to} {...rest}>
        {children}
      </Link>
    );
  }

  if ("href" in props && props.href) {
    const {
      children,
      href,
      className: _className,
      variant,
      size,
      fullWidth,
      target,
      rel,
      ...rest
    } = props;

    return (
      <a
        className={className}
        href={href}
        rel={target === "_blank" ? rel ?? "noopener noreferrer" : rel}
        target={target}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    children,
    className: _className,
    variant,
    size,
    fullWidth,
    type = "button",
    ...rest
  } = props as ButtonProps;

  return (
    <button className={className} type={type} {...rest}>
      {children}
    </button>
  );
}
