import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  companyInfo,
  footerServiceLinks,
  legalLinks,
  quickLinks,
} from "../../data/site";
import Button from "../ui/Button";

const socialLinks = [
  { label: "Facebook", href: companyInfo.liveUrl, icon: Facebook },
  { label: "Instagram", href: companyInfo.liveUrl, icon: Instagram },
  { label: "X", href: companyInfo.liveUrl, icon: Twitter },
  { label: "YouTube", href: companyInfo.liveUrl, icon: Youtube },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  return (
    <footer className="bg-slate-950 text-slate-200">
      <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.3fr_0.9fr_1fr_1.2fr]">
        <div className="space-y-6">
          <Link className="inline-flex items-center gap-3" to="/">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-2xl font-black text-white">
              P
            </div>
            <div>
              <div className="text-xl font-black leading-none text-white">Peter</div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.34em] text-slate-400">
                Car Rental
              </div>
            </div>
          </Link>

          <p className="max-w-sm text-sm leading-7 text-slate-400">
            {companyInfo.shortDescription.replace("?", "-")}
          </p>

          <div className="flex items-center gap-3">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:border-orange-400 hover:text-white"
                href={href}
                key={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Quick Links</h3>
          <div className="mt-5 space-y-3">
            {quickLinks.map((link) => (
              <Link className="block text-sm text-slate-400 transition hover:text-orange-400" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Services</h3>
          <div className="mt-5 space-y-3">
            {footerServiceLinks.map((link) => (
              <Link className="block text-sm text-slate-400 transition hover:text-orange-400" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-white">Contact Us</h3>
          <div className="mt-5 space-y-4 text-sm text-slate-400">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 text-orange-400" />
              <span>{companyInfo.locationFull}</span>
            </div>
            <a className="flex items-center gap-3 hover:text-orange-400" href={companyInfo.telHref}>
              <Phone className="h-4 w-4 text-orange-400" />
              <span>{companyInfo.phoneDisplay}</span>
            </a>
            <a className="flex items-center gap-3 hover:text-orange-400" href={companyInfo.mailtoHref}>
              <Mail className="h-4 w-4 text-orange-400" />
              <span>{companyInfo.email}</span>
            </a>
            <a
              className="text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              href={companyInfo.whatsappShareHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="mt-6 space-y-3">
            <p className="font-semibold text-white">Newsletter</p>
            <form
              className="space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (!email.trim()) return;
                setJoined(true);
                setEmail("");
              }}
            >
              <input
                className="w-full rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-orange-400"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email"
                type="email"
                value={email}
              />
              <Button fullWidth type="submit">
                Join
              </Button>
            </form>
            {joined ? <p className="text-xs text-emerald-400">Thanks for joining our newsletter.</p> : null}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-3 py-5 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© 2026 Peter Car Rental. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link className="transition hover:text-orange-400" key={link.to} to={link.to}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
