import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { usePublicData } from "../components/providers/PublicDataProvider";
import { getBlogPostBySlug } from "../lib/firestore-public";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const { data } = usePublicData();
  const blogPosts = data?.blogPosts ?? [];

  const post = useMemo(
    () => getBlogPostBySlug(blogPosts, slug),
    [blogPosts, slug],
  );
  const relatedPosts = useMemo(
    () => blogPosts.filter((p) => (p.slug ?? p.id) !== slug).slice(0, 2),
    [blogPosts, slug],
  );

  if (!post) {
    return (
      <section className="section-space">
        <div className="container-shell">
          <Card className="p-10 text-center">
            <h1 className="text-3xl font-black text-slate-950">Article not found</h1>
            <p className="mt-3 text-slate-600">The article you requested is not available.</p>
            <div className="mt-6">
              <Button to="/blog">Back to blog</Button>
            </div>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <>
      <Seo
        canonicalPath={`/blog/${post.slug}`}
        description={post.excerpt}
        title={`${post.title} | Peter Car Rental`}
      />
      <PageHero
        description={post.excerpt}
        eyebrow={(post as { category?: string }).category ?? "Article"}
        image={(post as { image?: string }).image ?? ""}
        title={post.title}
      >
        <Button to="/blog" variant="light">
          Back to blog
        </Button>
        <Button to="/booking" variant="whatsapp">
          Plan Your Trip
        </Button>
      </PageHero>

      <section className="section-space">
        <div className="container-shell grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card className="p-5 sm:p-6 md:p-8">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-500">
                <span>{(post as { date?: string }).date ?? ""}</span>
                <span className="text-slate-300">|</span>
                <span>{(post as { readingTime?: string }).readingTime ?? "5 min"}</span>
              </div>

              {((post as { sections?: { heading: string; body: string }[] }).sections ?? []).map((section) => (
                <div className="space-y-3" key={section.heading}>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
                    {section.heading}
                  </h2>
                  <p className="text-base leading-7 text-slate-600 sm:leading-8">{section.body}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4 sm:space-y-6">
            <Card className="p-5 sm:p-6">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Key Takeaways
                </p>
                <ul className="space-y-3">
                  {((post as { highlights?: string[] }).highlights ?? []).map((highlight) => (
                    <li
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                      key={highlight}
                    >
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">
                  Related Reads
                </p>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div className="space-y-2" key={relatedPost.slug ?? relatedPost.id}>
                      <h3 className="text-lg font-bold text-slate-950">{relatedPost.title}</h3>
                      <p className="text-sm leading-6 text-slate-600">{relatedPost.excerpt}</p>
                      <Link
                        className="text-sm font-semibold text-orange-600 transition hover:text-orange-700"
                        to={`/blog/${relatedPost.slug ?? relatedPost.id}`}
                      >
                        Read article
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
