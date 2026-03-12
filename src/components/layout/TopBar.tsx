import { Mail, MapPin, Phone } from "lucide-react";
import { companyInfo } from "../../data/site";
import Button from "../ui/Button";

export default function TopBar() {
  return (
    <div className="bg-slate-950 text-slate-200">
      <div className="container-shell flex flex-col gap-2 py-2.5 text-xs sm:text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-5">
          <a className="inline-flex items-center gap-2 hover:text-white" href={companyInfo.telHref}>
            <Phone className="h-4 w-4 text-orange-400" />
            <span>{companyInfo.phoneDisplay}</span>
          </a>
          <a className="inline-flex items-center gap-2 hover:text-white" href={companyInfo.mailtoHref}>
            <Mail className="h-4 w-4 text-orange-400" />
            <span className="break-all sm:break-normal">{companyInfo.email}</span>
          </a>
          <span className="hidden items-center gap-2 text-slate-300 md:inline-flex">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span>{companyInfo.locationShort}</span>
          </span>
        </div>

        <Button
          className="w-full justify-center sm:w-auto sm:self-start md:self-auto"
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
