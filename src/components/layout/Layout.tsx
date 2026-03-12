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
      <main className="overflow-x-clip">
        <Outlet />
      </main>
      <Footer />

      <a
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30 transition hover:bg-emerald-600 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14"
        href={companyInfo.whatsappShareHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </a>
    </div>
  );
}
