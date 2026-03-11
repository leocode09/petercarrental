import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CarFront,
  CarTaxiFront,
  Compass,
  Plane,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ServiceIconKey } from "../../data/services";

const iconMap: Record<ServiceIconKey, LucideIcon> = {
  selfDrive: CarFront,
  chauffeur: CarTaxiFront,
  airport: Plane,
  corporate: BriefcaseBusiness,
  longTerm: ShieldCheck,
  safari: Compass,
  events: Sparkles,
};

interface ServiceIconProps {
  iconKey: ServiceIconKey;
  className?: string;
}

export default function ServiceIcon({ iconKey, className }: ServiceIconProps) {
  const Icon = iconMap[iconKey];

  return <Icon className={className} />;
}
