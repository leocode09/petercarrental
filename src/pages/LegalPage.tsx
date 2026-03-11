import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";

interface LegalPageProps {
  title: string;
  canonicalPath: string;
  intro: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
}

export default function LegalPage({ title, canonicalPath, intro, sections }: LegalPageProps) {
  return (
    <>
      <Seo canonicalPath={canonicalPath} title={`${title} | Peter Car Rental`} />
      <PageHero
        compact
        description={intro}
        eyebrow="Legal"
        title={title}
      />

      <section className="section-space">
        <div className="container-shell max-w-4xl space-y-6">
          {sections.map((section) => (
            <Card className="p-8" key={section.heading}>
              <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">
                {section.heading}
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">{section.body}</p>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
