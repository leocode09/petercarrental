import { MessageCircle } from "lucide-react";
import { Outlet } from "react-router-dom";
import { companyInfo } from "../../data/site";
import Footer from "./Footer";
import Header from "./Header";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />

      <a
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-6 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 transition hover:bg-emerald-600"
        href={companyInfo.whatsappShareHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
