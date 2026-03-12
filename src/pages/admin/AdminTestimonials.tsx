import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listTestimonials, upsertTestimonial } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyForm = {
  testimonialId: undefined as string | undefined,
  publicId: "",
  author: "",
  quote: "",
  summary: "",
  sortOrder: 0,
};

export default function AdminTestimonials() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: testimonials, refetch } = useFirestoreQuery(listTestimonials);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      await upsertTestimonial(adminUser._id, {
        testimonialId: form.testimonialId,
        publicId: form.publicId,
        author: form.author,
        quote: form.quote,
        summary: form.summary,
        sortOrder: Number(form.sortOrder),
      });
      setForm({ ...emptyForm, sortOrder: testimonials?.length ?? 0 });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Manage customer testimonials shown on the home page and reviews page."
      title="Testimonials"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Testimonial records</h2>
              <p className="mt-2 text-sm text-slate-600">{testimonials?.length ?? 0} testimonials synced with the public site.</p>
            </div>
            <Button onClick={() => setForm({ ...emptyForm, sortOrder: testimonials?.length ?? 0 })} type="button" variant="outline">
              New Testimonial
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {testimonials?.map((t) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={t.id}
                onClick={() =>
                  setForm({
                    testimonialId: t.id,
                    publicId: t.publicId ?? "",
                    author: t.author ?? "",
                    quote: t.quote ?? "",
                    summary: t.summary ?? "",
                    sortOrder: t.sortOrder ?? 0,
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{t.author}</div>
                  <div className="mt-1 line-clamp-2 text-sm text-slate-600">{t.quote}</div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.testimonialId ? "Edit testimonial" : "Create testimonial"}</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Public ID</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, publicId: e.target.value }))}
                  placeholder="Public ID (e.g. sarah-johnson)"
                  value={form.publicId}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Author name</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, author: e.target.value }))}
                  placeholder="Author name"
                  value={form.author}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-slate-700">Sort order</span>
                <input
                  className={inputClassName}
                  onChange={(e) => setForm((c) => ({ ...c, sortOrder: Number(e.target.value) }))}
                  placeholder="Sort order"
                  type="number"
                  value={form.sortOrder}
                />
              </label>
            </div>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Quote</span>
              <textarea
                className={textareaClassName}
                onChange={(e) => setForm((c) => ({ ...c, quote: e.target.value }))}
                placeholder="Quote"
                value={form.quote}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-700">Summary</span>
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, summary: e.target.value }))}
                placeholder="Summary (e.g. USA - Safari Trip - Land Cruiser Prado)"
                value={form.summary}
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.testimonialId ? "Update Testimonial" : "Create Testimonial"}
              </Button>
              <Button onClick={() => setForm({ ...emptyForm, sortOrder: testimonials?.length ?? 0 })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
