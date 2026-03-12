import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePublicData } from "../providers/PublicDataProvider";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function BlogPreview() {
  const { data } = usePublicData();
  const blogPosts = data?.blogPosts ?? [];
  return (
    <section className="section-space bg-slate-50">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
              Blog
            </p>
            <h2 className="page-section-title text-slate-950">Travel Tips &amp; Guides</h2>
          </div>
          <Button className="w-full sm:w-auto" to="/blog" variant="outline">
            View Blog
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.slice(0, 6).map((post) => (
            <Card className="overflow-hidden" key={post.slug ?? post.id}>
              <img alt={post.title} className="h-52 w-full object-cover sm:h-56" loading="lazy" src={(post as { image?: string }).image ?? ""} />
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                  <span>{(post as { category?: string }).category ?? "Article"}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-400">{(post as { readingTime?: string }).readingTime ?? "5 min"}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-950">{post.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
                </div>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                  to={`/blog/${post.slug ?? post.id}`}
                >
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
