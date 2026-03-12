import { Link } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";
import { usePublicData } from "../components/providers/PublicDataProvider";

export default function Blog() {
  const { data } = usePublicData();
  const blogPosts = data?.blogPosts ?? [];
  return (
    <>
      <Seo canonicalPath="/blog" title="Blog | Peter Car Rental" />
      <PageHero
        description="Driving tips, travel planning advice, and Rwanda-focused guides to help you make the most of every booking."
        eyebrow="Blog"
        image="https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1600&q=80"
        title="Travel tips and planning guides"
      />

      <section className="section-space">
        <div className="container-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {blogPosts.map((post) => (
            <Card className="overflow-hidden" key={post.slug}>
              <img alt={post.title} className="h-52 w-full object-cover sm:h-56" src={post.image} />
              <div className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em] text-orange-500">
                  <span>{(post as { category?: string }).category ?? "Article"}</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-500">{(post as { date?: string }).date ?? ""}</span>
                </div>
                <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
                  {post.title}
                </h2>
                <p className="text-sm leading-6 text-slate-600">{post.excerpt}</p>
                <p className="text-sm font-semibold text-slate-500">
                  {(post as { readingTime?: string }).readingTime ?? "5 min"}
                </p>
                <Link
                  className="inline-flex text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                  to={`/blog/${post.slug ?? post.id}`}
                >
                  Read article
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
