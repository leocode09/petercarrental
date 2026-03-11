import Seo from "../components/seo/Seo";
import PageHero from "../components/shared/PageHero";
import Card from "../components/ui/Card";

const faqs = [
  {
    question: "What documents do I need for a rental?",
    answer: "A valid driver's license, passport or national ID, and your booking details are typically required.",
  },
  {
    question: "Can you deliver to Kigali Airport or my hotel?",
    answer: "Yes. We offer airport handoffs, hotel delivery, Kigali city pickup, and custom location coordination.",
  },
  {
    question: "Do you offer self-drive and chauffeur options?",
    answer: "Yes. You can choose self-drive or a chauffeur-driven service depending on your itinerary and preferences.",
  },
  {
    question: "Which vehicle is best for park trips?",
    answer: "For Akagera, Volcanoes, and similar routes, our Prado, Hilux, and RAV4 options are the most popular.",
  },
  {
    question: "Can organizations arrange long-term or project rentals?",
    answer: "Yes. We support NGO, embassy, and corporate clients with flexible long-term packages and account coordination.",
  },
];

export default function FAQ() {
  return (
    <>
      <Seo canonicalPath="/faq" title="FAQ | Peter Car Rental" />
      <PageHero
        description="Answers to the questions we hear most about bookings, delivery, documentation, and choosing the right vehicle."
        eyebrow="FAQ"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80"
        title="Frequently asked questions"
      />

      <section className="section-space">
        <div className="container-shell space-y-4">
          {faqs.map((item) => (
            <Card className="p-0" key={item.question}>
              <details className="group p-6">
                <summary className="cursor-pointer list-none text-lg font-bold text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-4 text-sm leading-7 text-slate-600">{item.answer}</p>
              </details>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
