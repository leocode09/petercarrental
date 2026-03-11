import Seo from "../components/seo/Seo";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function NotFound() {
  return (
    <>
      <Seo canonicalPath="/404" title="Page Not Found | Peter Car Rental" />
      <section className="section-space">
        <div className="container-shell">
          <Card className="mx-auto max-w-2xl p-10 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-500">404</p>
            <h1 className="mt-3 text-4xl font-black tracking-[-0.04em] text-slate-950">
              Page not found
            </h1>
            <p className="mt-4 text-base leading-7 text-slate-600">
              The page you requested is not available, but your next ride still is.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button to="/">Go Home</Button>
              <Button to="/fleet" variant="outline">
                View Fleet
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
