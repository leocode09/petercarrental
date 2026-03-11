import { Mail, MapPin, Phone } from "lucide-react";
import { companyInfo } from "../../data/site";
import Button from "../ui/Button";

export default function TopBar() {
  return (
    <div className="bg-slate-950 text-slate-200">
      <div className="container-shell flex flex-col gap-3 py-3 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a className="inline-flex items-center gap-2 hover:text-white" href={companyInfo.telHref}>
            <Phone className="h-4 w-4 text-orange-400" />
            <span>{companyInfo.phoneDisplay}</span>
          </a>
          <a className="inline-flex items-center gap-2 hover:text-white" href={companyInfo.mailtoHref}>
            <Mail className="h-4 w-4 text-orange-400" />
            <span>{companyInfo.email}</span>
          </a>
          <span className="hidden items-center gap-2 text-slate-300 md:inline-flex">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span>{companyInfo.locationShort}</span>
          </span>
        </div>

        <Button
          className="self-start md:self-auto"
          href={companyInfo.whatsappShareHref}
          size="sm"
          target="_blank"
          variant="whatsapp"
        >
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
