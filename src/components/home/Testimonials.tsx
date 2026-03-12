import { Quote } from "lucide-react";
import { usePublicData } from "../providers/PublicDataProvider";

export default function Testimonials() {
  const { data } = usePublicData();
  const testimonials = data?.testimonials ?? [];
  return (
    <section className="section-space bg-slate-950 text-white">
      <div className="container-shell space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
            Testimonials
          </p>
          <h2 className="page-section-title text-white">What Our Customers Say</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div className="dark-surface rounded-[28px] p-6 sm:p-7" key={testimonial.id ?? testimonial.publicId}>
              <div className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-400">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="text-base leading-7 text-slate-100 sm:text-lg sm:leading-8">
                  &quot; {testimonial.quote} &quot;
                </p>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="mt-1 text-sm text-slate-400">{testimonial.summary}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
