import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import {
  listPricing,
  upsertPricingRule,
  upsertPromoCode,
} from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { getVehicleCategoriesFromList, usePublicSiteData } from "../../lib/publicData";
import { inputClassName } from "../../lib/utils";

const emptyRuleForm = {
  pricingRuleId: undefined as string | undefined,
  name: "",
  category: "",
  serviceType: "",
  startDate: "",
  endDate: "",
  rateMultiplier: 1,
  active: true,
};

const emptyPromoForm = {
  promoCodeId: undefined as string | undefined,
  code: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  amount: 10,
  active: true,
  startsAt: "",
  endsAt: "",
  usageLimit: "",
};

export default function AdminPricing() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: pricing, refetch } = useFirestoreQuery(listPricing);
  const { vehicles, serviceTypes } = usePublicSiteData();
  const vehicleCategories = getVehicleCategoriesFromList(vehicles);
  const [ruleForm, setRuleForm] = useState(emptyRuleForm);
  const [promoForm, setPromoForm] = useState(emptyPromoForm);

  const handleRuleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    await upsertPricingRule(adminUser._id, {
      pricingRuleId: ruleForm.pricingRuleId,
      name: ruleForm.name,
      category: ruleForm.category || undefined,
      serviceType: ruleForm.serviceType || undefined,
      startDate: ruleForm.startDate,
      endDate: ruleForm.endDate,
      rateMultiplier: Number(ruleForm.rateMultiplier),
      active: ruleForm.active,
    });
    setRuleForm(emptyRuleForm);
    await refetch();
  };

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    await upsertPromoCode(adminUser._id, {
      promoCodeId: promoForm.promoCodeId,
      code: promoForm.code,
      description: promoForm.description,
      discountType: promoForm.discountType,
      amount: Number(promoForm.amount),
      active: promoForm.active,
      startsAt: promoForm.startsAt ? new Date(`${promoForm.startsAt}T00:00:00Z`).getTime() : undefined,
      endsAt: promoForm.endsAt ? new Date(`${promoForm.endsAt}T23:59:59Z`).getTime() : undefined,
      usageLimit: promoForm.usageLimit ? Number(promoForm.usageLimit) : undefined,
    });
    setPromoForm(emptyPromoForm);
    await refetch();
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Control seasonal pricing, service uplifts, and public promo codes that influence booking estimates and conversion."
      title="Pricing & Promo Codes"
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Pricing rules</h2>
              <p className="mt-2 text-sm text-slate-600">Target categories or service types over specific date windows.</p>
            </div>
            <Button onClick={() => setRuleForm(emptyRuleForm)} type="button" variant="outline">
              New Rule
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {pricing?.pricingRules.map((rule) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={rule.id}
                onClick={() =>
                  setRuleForm({
                    pricingRuleId: rule.id,
                    name: rule.name,
                    category: rule.category ?? "",
                    serviceType: rule.serviceType ?? "",
                    startDate: rule.startDate,
                    endDate: rule.endDate,
                    rateMultiplier: rule.rateMultiplier,
                    active: rule.active,
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{rule.name}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {rule.startDate} to {rule.endDate} · x{rule.rateMultiplier}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {rule.active ? "active" : "inactive"}
                </div>
              </button>
            ))}
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handleRuleSubmit}>
            <input className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, name: event.target.value }))} placeholder="Rule name" value={ruleForm.name} />
            <input className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, rateMultiplier: Number(event.target.value) }))} placeholder="Rate multiplier" step="0.01" type="number" value={ruleForm.rateMultiplier} />
            <select className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, category: event.target.value }))} value={ruleForm.category}>
              <option value="">All categories</option>
              {vehicleCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, serviceType: event.target.value }))} value={ruleForm.serviceType}>
              <option value="">All service types</option>
              {serviceTypes.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <input className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, startDate: event.target.value }))} type="date" value={ruleForm.startDate} />
            <input className={inputClassName} onChange={(event) => setRuleForm((current) => ({ ...current, endDate: event.target.value }))} type="date" value={ruleForm.endDate} />
            <label className="md:col-span-2 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input checked={ruleForm.active} onChange={(event) => setRuleForm((current) => ({ ...current, active: event.target.checked }))} type="checkbox" />
              Rule is active
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">{ruleForm.pricingRuleId ? "Update Rule" : "Create Rule"}</Button>
              <Button onClick={() => setRuleForm(emptyRuleForm)} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Promo codes</h2>
              <p className="mt-2 text-sm text-slate-600">Manage public discounts used during booking requests and campaigns.</p>
            </div>
            <Button onClick={() => setPromoForm(emptyPromoForm)} type="button" variant="outline">
              New Code
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {pricing?.promoCodes.map((promo) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={promo.id}
                onClick={() =>
                  setPromoForm({
                    promoCodeId: promo.id,
                    code: promo.code,
                    description: promo.description,
                    discountType: promo.discountType,
                    amount: promo.amount,
                    active: promo.active,
                    startsAt: promo.startsAt ? new Date(promo.startsAt).toISOString().slice(0, 10) : "",
                    endsAt: promo.endsAt ? new Date(promo.endsAt).toISOString().slice(0, 10) : "",
                    usageLimit: promo.usageLimit?.toString() ?? "",
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{promo.code}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {promo.discountType} · {promo.amount} · used {promo.usedCount}
                  </div>
                </div>
                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                  {promo.active ? "active" : "inactive"}
                </div>
              </button>
            ))}
          </div>

          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={handlePromoSubmit}>
            <input className={inputClassName} onChange={(event) => setPromoForm((current) => ({ ...current, code: event.target.value }))} placeholder="Promo code" value={promoForm.code} />
            <input className={inputClassName} onChange={(event) => setPromoForm((current) => ({ ...current, amount: Number(event.target.value) }))} placeholder="Amount" type="number" value={promoForm.amount} />
            <select
              className={inputClassName}
              onChange={(event) =>
                setPromoForm((current) => ({
                  ...current,
                  discountType: event.target.value as typeof current.discountType,
                }))
              }
              value={promoForm.discountType}
            >
              <option value="percentage">percentage</option>
              <option value="fixed">fixed</option>
            </select>
            <input className={inputClassName} onChange={(event) => setPromoForm((current) => ({ ...current, usageLimit: event.target.value }))} placeholder="Usage limit" type="number" value={promoForm.usageLimit} />
            <input className={inputClassName} onChange={(event) => setPromoForm((current) => ({ ...current, startsAt: event.target.value }))} type="date" value={promoForm.startsAt} />
            <input className={inputClassName} onChange={(event) => setPromoForm((current) => ({ ...current, endsAt: event.target.value }))} type="date" value={promoForm.endsAt} />
            <input className="md:col-span-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100" onChange={(event) => setPromoForm((current) => ({ ...current, description: event.target.value }))} placeholder="Promo description" value={promoForm.description} />
            <label className="md:col-span-2 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input checked={promoForm.active} onChange={(event) => setPromoForm((current) => ({ ...current, active: event.target.checked }))} type="checkbox" />
              Promo code is active
            </label>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit">{promoForm.promoCodeId ? "Update Promo Code" : "Create Promo Code"}</Button>
              <Button onClick={() => setPromoForm(emptyPromoForm)} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
