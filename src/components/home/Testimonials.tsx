import { Quote } from "lucide-react";
import { testimonials } from "../../data/testimonials";

export default function Testimonials() {
  return (
    <section className="section-space bg-slate-950 text-white">
      <div className="container-shell space-y-10">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
            Testimonials
          </p>
          <h2 className="page-section-title text-white">What Our Customers Say</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <div className="dark-surface rounded-[28px] p-7" key={testimonial.id}>
              <div className="space-y-5">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-400">
                  <Quote className="h-5 w-5" />
                </div>
                <p className="text-lg leading-8 text-slate-100">&quot; {testimonial.quote} &quot;</p>
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
