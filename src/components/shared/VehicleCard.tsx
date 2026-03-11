import { Fuel, Luggage, Settings2, Users } from "lucide-react";
import type { Vehicle } from "../../data/vehicles";
import { buildWhatsAppLink, cn, formatPricePerDay } from "../../lib/utils";
import Button from "../ui/Button";
import Card from "../ui/Card";

interface VehicleCardProps {
  vehicle: Vehicle;
  className?: string;
  showDescription?: boolean;
}

export default function VehicleCard({
  vehicle,
  className,
  showDescription = true,
}: VehicleCardProps) {
  const whatsappMessage = `Hello Peter Car Rental, I would like to book the ${vehicle.name}. Please share availability and pricing details.`;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <div className="relative">
        <img
          alt={vehicle.name}
          className="h-64 w-full object-cover"
          loading="lazy"
          src={vehicle.image}
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
          <span className="rounded-full bg-slate-950/80 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {vehicle.category}
          </span>
          {vehicle.badge ? (
            <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
              {vehicle.badge}
            </span>
          ) : null}
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-slate-950">{vehicle.name}</h3>
            <p className="mt-1 text-sm font-medium text-orange-600">{formatPricePerDay(vehicle.pricePerDay)}</p>
          </div>
        </div>

        {showDescription ? <p className="text-sm leading-6 text-slate-600">{vehicle.description}</p> : null}

        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
            <Users className="h-4 w-4 text-orange-500" />
            <span>{vehicle.seats} seats</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
            <Luggage className="h-4 w-4 text-orange-500" />
            <span>{vehicle.luggage} bags</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
            <Settings2 className="h-4 w-4 text-orange-500" />
            <span>{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2">
            <Fuel className="h-4 w-4 text-orange-500" />
            <span>{vehicle.fuel}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            to={`/booking?vehicle=${encodeURIComponent(vehicle.id)}&category=${encodeURIComponent(vehicle.category)}`}
          >
            Book Now
          </Button>
          <Button href={buildWhatsAppLink(whatsappMessage)} target="_blank" variant="outline">
            Ask on WhatsApp
          </Button>
        </div>
      </div>
    </Card>
  );
}
