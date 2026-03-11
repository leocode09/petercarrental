import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { blogPosts } from "../../data/blog";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function BlogPreview() {
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
          <Button to="/blog" variant="outline">
            View Blog
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Card className="overflow-hidden" key={post.slug}>
              <img alt={post.title} className="h-56 w-full object-cover" loading="lazy" src={post.image} />
              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-orange-500">
                  <span>{post.category}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-400">{post.readingTime}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-950">{post.title}</h3>
                  <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
                </div>
                <Link
                  className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                  to="/blog"
                >
                  Read
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
