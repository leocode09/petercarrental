import { useEffect, useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { getSiteSettings, updateSiteSettings } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import {
  parseLineList,
  stringifyLineList,
  parseLinkRows,
  stringifyLinkRows,
  parseLeadershipRows,
  stringifyLeadershipRows,
  parseNavLinkRows,
  stringifyNavLinkRows,
} from "../../lib/adminForms";
import type { CompanyInfo, LinkItem, NavLink } from "../../lib/firestore-public";
import { inputClassName, textareaClassName } from "../../lib/utils";

export default function AdminSiteSettings() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: settings, refetch } = useFirestoreQuery(getSiteSettings);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    defaultTitle: "",
    shortDescription: "",
    metaDescription: "",
    phoneDisplay: "",
    phoneNumber: "",
    email: "",
    whatsappNumber: "",
    locationShort: "",
    locationFull: "",
    canonicalUrl: "",
    liveUrl: "",
    heroImage: "",
    ogImage: "",
    bookingLocationsText: "",
    serviceTypesText: "",
    navLinksText: "",
    quickLinksText: "",
    footerServiceLinksText: "",
    legalLinksText: "",
    leadershipText: "",
  });

  useEffect(() => {
    if (!settings) return;
    const ci = (settings.companyInfo ?? {}) as CompanyInfo;
    setForm({
      name: ci.name ?? "Peter Car Rental",
      defaultTitle: ci.defaultTitle ?? "",
      shortDescription: ci.shortDescription ?? "",
      metaDescription: ci.metaDescription ?? "",
      phoneDisplay: ci.phoneDisplay ?? "",
      phoneNumber: ci.phoneNumber ?? "",
      email: ci.email ?? "",
      whatsappNumber: ci.whatsappNumber ?? "",
      locationShort: ci.locationShort ?? "",
      locationFull: ci.locationFull ?? "",
      canonicalUrl: ci.canonicalUrl ?? "",
      liveUrl: ci.liveUrl ?? "",
      heroImage: ci.heroImage ?? "",
      ogImage: ci.ogImage ?? "",
      bookingLocationsText: stringifyLineList(settings.bookingLocations),
      serviceTypesText: stringifyLineList(settings.serviceTypes),
      navLinksText: stringifyNavLinkRows(settings.navLinks as NavLink[]),
      quickLinksText: stringifyLinkRows(settings.quickLinks),
      footerServiceLinksText: stringifyLinkRows(settings.footerServiceLinks),
      legalLinksText: stringifyLinkRows(settings.legalLinks),
      leadershipText: stringifyLeadershipRows(settings.leadershipMembers),
    });
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      const phone = form.phoneNumber.replace(/\D/g, "");
      const companyInfo: CompanyInfo = {
        name: form.name,
        defaultTitle: form.defaultTitle,
        shortDescription: form.shortDescription,
        metaDescription: form.metaDescription,
        phoneDisplay: form.phoneDisplay,
        phoneNumber: form.phoneNumber,
        email: form.email,
        whatsappNumber: form.whatsappNumber,
        locationShort: form.locationShort,
        locationFull: form.locationFull,
        canonicalUrl: form.canonicalUrl,
        liveUrl: form.liveUrl,
        heroImage: form.heroImage,
        ogImage: form.ogImage,
        telHref: `tel:${form.phoneNumber}`,
        mailtoHref: `mailto:${form.email}`,
        whatsappHref: `https://wa.me/${phone}`,
        whatsappShareHref: `https://api.whatsapp.com/send/?phone=${phone}&text&type=phone_number&app_absent=0`,
      };

      await updateSiteSettings(adminUser._id, {
        companyInfo,
        bookingLocations: parseLineList(form.bookingLocationsText),
        serviceTypes: parseLineList(form.serviceTypesText),
        navLinks: parseNavLinkRows(form.navLinksText),
        quickLinks: parseLinkRows(form.quickLinksText),
        footerServiceLinks: parseLinkRows(form.footerServiceLinksText),
        legalLinks: parseLinkRows(form.legalLinksText),
        leadershipMembers: parseLeadershipRows(form.leadershipText),
      });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Edit company info, navigation, footer links, and leadership team. Changes affect the public site immediately."
      title="Site Settings"
    >
      <form className="grid gap-6" onSubmit={handleSubmit}>
        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Company info</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Company name</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Company name" value={form.name} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Default page title</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, defaultTitle: e.target.value }))} placeholder="Default page title" value={form.defaultTitle} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Phone display</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, phoneDisplay: e.target.value }))} placeholder="Phone display" value={form.phoneDisplay} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Phone number</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, phoneNumber: e.target.value }))} placeholder="Phone number" value={form.phoneNumber} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} placeholder="Email" type="email" value={form.email} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">WhatsApp number</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, whatsappNumber: e.target.value }))} placeholder="WhatsApp number" value={form.whatsappNumber} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Location short</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, locationShort: e.target.value }))} placeholder="Location short" value={form.locationShort} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Location full</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, locationFull: e.target.value }))} placeholder="Location full" value={form.locationFull} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Canonical URL</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, canonicalUrl: e.target.value }))} placeholder="Canonical URL" value={form.canonicalUrl} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Live URL</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, liveUrl: e.target.value }))} placeholder="Live URL" value={form.liveUrl} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Hero image URL</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, heroImage: e.target.value }))} placeholder="Hero image URL" value={form.heroImage} />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">OG image URL</span>
              <input className={inputClassName} onChange={(e) => setForm((c) => ({ ...c, ogImage: e.target.value }))} placeholder="OG image URL" value={form.ogImage} />
            </label>
          </div>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Short description</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, shortDescription: e.target.value }))} placeholder="Short description" value={form.shortDescription} />
          </label>
          <label className="mt-2 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Meta description</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, metaDescription: e.target.value }))} placeholder="Meta description" value={form.metaDescription} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Booking & services</h2>
          <p className="mt-2 text-sm text-slate-600">Booking locations and service types for the reservation form.</p>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Booking locations</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, bookingLocationsText: e.target.value }))} placeholder="Booking locations (one per line)" value={form.bookingLocationsText} />
          </label>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Service types</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, serviceTypesText: e.target.value }))} placeholder="Service types (one per line)" value={form.serviceTypesText} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Navigation links</h2>
          <p className="mt-2 text-sm text-slate-600">Main nav. Use &quot;&gt; label | to&quot; for dropdown children.</p>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Navigation links</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, navLinksText: e.target.value }))} placeholder="label | to&#10;> child | /path" value={form.navLinksText} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Quick links</h2>
          <p className="mt-2 text-sm text-slate-600">Footer quick links: label | to</p>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Quick links</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, quickLinksText: e.target.value }))} placeholder="label | to | description" value={form.quickLinksText} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Footer service links</h2>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Footer service links</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, footerServiceLinksText: e.target.value }))} placeholder="label | to" value={form.footerServiceLinksText} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Legal links</h2>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Legal links</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, legalLinksText: e.target.value }))} placeholder="label | to" value={form.legalLinksText} />
          </label>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">Leadership team</h2>
          <p className="mt-2 text-sm text-slate-600">name | title | bio (one per line)</p>
          <label className="mt-4 flex flex-col gap-2">
            <span className="text-sm font-semibold text-slate-700">Leadership team</span>
            <textarea className={textareaClassName} onChange={(e) => setForm((c) => ({ ...c, leadershipText: e.target.value }))} placeholder="Name | Title | Bio" value={form.leadershipText} />
          </label>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button disabled={saving} type="submit">
            {saving ? "Saving..." : "Save site settings"}
          </Button>
        </div>
      </form>
    </AdminPageShell>
  );
}
