import { MessageCircle } from "lucide-react";
import { Outlet } from "react-router-dom";
import { usePublicData } from "../providers/PublicDataProvider";
import Footer from "./Footer";
import Header from "./Header";
import TopBar from "./TopBar";

export default function Layout() {
  const { data, loading, error, retry } = usePublicData();

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {(loading || error) && (
        <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {error ? "Site content unavailable" : "Loading site content…"}
              </p>
              {error && (
                <p className="truncate text-xs text-slate-500">{error}</p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {loading && (
                <div
                  aria-label="Loading"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"
                />
              )}
              {(error || !loading) && (
                <button
                  className="rounded-md bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-orange-600"
                  onClick={retry}
                  type="button"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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
