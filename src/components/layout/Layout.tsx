import { MessageCircle } from "lucide-react";
import { Outlet } from "react-router-dom";
import { usePublicData } from "../providers/PublicDataProvider";
import Footer from "./Footer";
import Header from "./Header";
import TopBar from "./TopBar";

export default function Layout() {
  const { data, loading } = usePublicData();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6">
        <p className="text-center text-slate-600">Loading site content…</p>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      </div>
    );
  }

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
        href={data.companyInfo.whatsappShareHref}
        rel="noopener noreferrer"
        target="_blank"
      >
        <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      </a>
    </div>
  );
}
