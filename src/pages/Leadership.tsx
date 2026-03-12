import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";
import { usePublicData } from "../components/providers/PublicDataProvider";

export default function Leadership() {
  const { data } = usePublicData();
  const team = data?.leadershipMembers ?? [];
  return (
    <>
      <Seo canonicalPath="/leadership" title="Leadership | Peter Car Rental" />
      <PageHero
        description="Meet the people behind the brand and the service culture that keeps Peter Car Rental trusted across Rwanda."
        eyebrow="Leadership"
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
        title="The team behind every smooth journey"
      />

      <section className="section-space">
        <div className="container-shell grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {team.length > 0 ? team.map((member) => (
            <Card className="h-full p-6 sm:p-7" key={member.name}>
              <div className="space-y-4">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-xl font-black text-orange-600">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-black tracking-[-0.03em] text-slate-950 sm:text-2xl">
                    {member.name}
                  </h2>
                  <p className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-orange-500">
                    {member.title}
                  </p>
                </div>
                <p className="text-sm leading-7 text-slate-600">{member.bio}</p>
              </div>
            </Card>
          )) : (
            <Card className="p-10 text-center">
              <p className="text-slate-600">Leadership team information is being loaded.</p>
            </Card>
          )}
        </div>
      </section>
    </>
  );
}
