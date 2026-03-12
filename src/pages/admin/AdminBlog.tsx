import { useState } from "react";
import AdminPageShell from "../../components/admin/AdminPageShell";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import { useAuth } from "../../lib/auth-context";
import { listBlogPosts, upsertBlogPost } from "../../lib/firestore-admin";
import { useFirestoreQuery } from "../../lib/useFirestoreQuery";
import { parseKeyValuePairs, stringifyKeyValuePairs, parseLineList, stringifyLineList } from "../../lib/adminForms";
import { inputClassName, textareaClassName } from "../../lib/utils";

const emptyForm = {
  blogPostId: undefined as string | undefined,
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  image: "",
  category: "",
  date: "",
  readingTime: "5 min read",
  highlightsText: "",
  sectionsText: "",
  published: true,
  sortOrder: 0,
};

export default function AdminBlog() {
  const { adminUser, loading: authLoading } = useAuth();
  const { data: blogPosts, refetch } = useFirestoreQuery(listBlogPosts);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminUser) return;
    setSaving(true);
    try {
      const sections = parseKeyValuePairs(form.sectionsText);
      await upsertBlogPost(adminUser._id, {
        blogPostId: form.blogPostId,
        slug: form.slug,
        title: form.title,
        excerpt: form.excerpt,
        content: form.content || undefined,
        image: form.image || undefined,
        category: form.category || undefined,
        date: form.date || undefined,
        readingTime: form.readingTime || undefined,
        highlights: parseLineList(form.highlightsText),
        sections: sections.map((s) => ({ heading: s.heading, body: s.body })),
        published: form.published,
        sortOrder: Number(form.sortOrder),
      });
      setForm({ ...emptyForm, sortOrder: blogPosts?.length ?? 0 });
      await refetch();
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) return null;

  return (
    <AdminPageShell
      description="Create and manage blog posts. Control visibility with published status."
      title="Blog"
    >
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-slate-950">Blog posts</h2>
              <p className="mt-2 text-sm text-slate-600">{blogPosts?.length ?? 0} posts. Only published posts appear on the public site.</p>
            </div>
            <Button onClick={() => setForm({ ...emptyForm, sortOrder: blogPosts?.length ?? 0 })} type="button" variant="outline">
              New Post
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {blogPosts?.map((p) => (
              <button
                className="flex w-full items-start justify-between rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-orange-300 hover:bg-orange-50/40"
                key={p.id}
                onClick={() =>
                  setForm({
                    blogPostId: p.id,
                    slug: (p as { slug?: string }).slug ?? "",
                    title: (p as { title?: string }).title ?? "",
                    excerpt: (p as { excerpt?: string }).excerpt ?? "",
                    content: (p as { content?: string }).content ?? "",
                    image: (p as { image?: string }).image ?? "",
                    category: (p as { category?: string }).category ?? "",
                    date: (p as { date?: string }).date ?? "",
                    readingTime: (p as { readingTime?: string }).readingTime ?? "5 min read",
                    highlightsText: stringifyLineList((p as { highlights?: string[] }).highlights),
                    sectionsText: stringifyKeyValuePairs((p as { sections?: { heading: string; body: string }[] }).sections),
                    published: (p as { published?: boolean }).published ?? true,
                    sortOrder: (p as { sortOrder?: number }).sortOrder ?? 0,
                  })
                }
                type="button"
              >
                <div>
                  <div className="font-semibold text-slate-950">{(p as { title?: string }).title ?? p.id}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {(p as { published?: boolean }).published ? "Published" : "Draft"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-black text-slate-950">{form.blogPostId ? "Edit post" : "Create post"}</h2>
          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, slug: e.target.value }))}
                placeholder="Slug"
                value={form.slug}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, title: e.target.value }))}
                placeholder="Title"
                value={form.title}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, category: e.target.value }))}
                placeholder="Category"
                value={form.category}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, date: e.target.value }))}
                placeholder="Date (e.g. Mar 2026)"
                value={form.date}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, readingTime: e.target.value }))}
                placeholder="Reading time"
                value={form.readingTime}
              />
              <input
                className={inputClassName}
                onChange={(e) => setForm((c) => ({ ...c, sortOrder: Number(e.target.value) }))}
                placeholder="Sort order"
                type="number"
                value={form.sortOrder}
              />
            </div>

            <input
              className={inputClassName}
              onChange={(e) => setForm((c) => ({ ...c, image: e.target.value }))}
              placeholder="Image URL"
              value={form.image}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, excerpt: e.target.value }))}
              placeholder="Excerpt"
              value={form.excerpt}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, highlightsText: e.target.value }))}
              placeholder="Key takeaways (one per line)"
              value={form.highlightsText}
            />
            <textarea
              className={textareaClassName}
              onChange={(e) => setForm((c) => ({ ...c, sectionsText: e.target.value }))}
              placeholder="Sections: heading | body (one per line)"
              value={form.sectionsText}
            />

            <label className="inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                checked={form.published}
                onChange={(e) => setForm((c) => ({ ...c, published: e.target.checked }))}
                type="checkbox"
              />
              Published (visible on public site)
            </label>

            <div className="flex flex-wrap gap-3">
              <Button disabled={saving} type="submit">
                {saving ? "Saving..." : form.blogPostId ? "Update Post" : "Create Post"}
              </Button>
              <Button onClick={() => setForm({ ...emptyForm, sortOrder: blogPosts?.length ?? 0 })} type="button" variant="outline">
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminPageShell>
  );
}
