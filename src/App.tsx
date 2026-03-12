import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import AdminLayout from "./components/admin/AdminLayout";
import AdminPortalProvider from "./components/admin/AdminPortalProvider";
import RequireAdminRoute from "./components/admin/RequireAdminRoute";
import Layout from "./components/layout/Layout";
import PublicDataProvider from "./components/providers/PublicDataProvider";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Booking from "./pages/Booking";
import Complaints from "./pages/Complaints";
import Contact from "./pages/Contact";
import DestinationDetail from "./pages/DestinationDetail";
import Destinations from "./pages/Destinations";
import FAQ from "./pages/FAQ";
import Fleet from "./pages/Fleet";
import Gallery from "./pages/Gallery";
import Home from "./pages/Home";
import Leadership from "./pages/Leadership";
import LegalPage from "./pages/LegalPage";
import ManageBooking from "./pages/ManageBooking";
import NotFound from "./pages/NotFound";
import Reviews from "./pages/Reviews";
import ServiceDetail from "./pages/ServiceDetail";
import Services from "./pages/Services";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDestinations from "./pages/admin/AdminDestinations";
import AdminFleet from "./pages/admin/AdminFleet";
import AdminInbox from "./pages/admin/AdminInbox";
import AdminPricing from "./pages/admin/AdminPricing";
import AdminReports from "./pages/admin/AdminReports";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminServices from "./pages/admin/AdminServices";
import AdminSiteSettings from "./pages/admin/AdminSiteSettings";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminUsers from "./pages/admin/AdminUsers";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<AdminPortalProvider />} path="admin">
          <Route element={<RequireAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route element={<AdminDashboard />} index />
              <Route element={<AdminFleet />} path="fleet" />
              <Route element={<AdminReservations />} path="reservations" />
              <Route element={<AdminCustomers />} path="customers" />
              <Route element={<AdminPricing />} path="pricing" />
              <Route element={<AdminServices />} path="services" />
              <Route element={<AdminDestinations />} path="destinations" />
              <Route element={<AdminBlog />} path="blog" />
              <Route element={<AdminTestimonials />} path="testimonials" />
              <Route element={<AdminSiteSettings />} path="site-settings" />
              <Route element={<AdminInbox />} path="inbox" />
              <Route element={<AdminUsers />} path="users" />
              <Route element={<AdminReports />} path="reports" />
            </Route>
          </Route>
          <Route element={<Navigate replace to="/admin" />} path="*" />
        </Route>

        <Route element={<PublicDataProvider><Layout /></PublicDataProvider>} path="/">
          <Route element={<Home />} index />
          <Route element={<Fleet />} path="fleet" />
          <Route element={<Booking />} path="booking" />
          <Route element={<Services />} path="services" />
          <Route element={<ServiceDetail />} path="services/:slug" />
          <Route element={<Destinations />} path="destinations" />
          <Route element={<DestinationDetail />} path="destinations/:slug" />
          <Route element={<About />} path="about" />
          <Route element={<Leadership />} path="leadership" />
          <Route element={<Blog />} path="blog" />
          <Route element={<BlogPostDetail />} path="blog/:slug" />
          <Route element={<FAQ />} path="faq" />
          <Route element={<Gallery />} path="gallery" />
          <Route element={<Reviews />} path="reviews" />
          <Route element={<Contact />} path="contact" />
          <Route element={<ManageBooking />} path="manage-booking" />
          <Route element={<Complaints />} path="complaints" />

          <Route
            element={
              <LegalPage
                canonicalPath="/terms"
                intro="These terms outline the basic expectations for reservations, vehicle use, timing, and service coordination."
                sections={[
                  {
                    heading: "Reservations",
                    body: "Bookings are confirmed once availability, vehicle class, and pickup details are agreed with our team.",
                  },
                  {
                    heading: "Vehicle Use",
                    body: "Drivers are expected to follow local traffic laws, return vehicles in agreed condition, and report incidents promptly.",
                  },
                ]}
                title="Terms & Conditions"
              />
            }
            path="terms"
          />
          <Route
            element={
              <LegalPage
                canonicalPath="/privacy"
                intro="We use your booking and contact information to coordinate rentals, support communication, and service follow-up."
                sections={[
                  {
                    heading: "Information We Use",
                    body: "Contact details, itinerary information, and booking preferences are used only for service coordination and support.",
                  },
                  {
                    heading: "Customer Communication",
                    body: "We may contact you by email, phone, or WhatsApp to confirm or adjust reservation details.",
                  },
                ]}
                title="Privacy Policy"
              />
            }
            path="privacy"
          />
          <Route
            element={
              <LegalPage
                canonicalPath="/cookies"
                intro="This site may use essential browser storage and analytics-related tools to improve the booking experience."
                sections={[
                  {
                    heading: "Essential Site Usage",
                    body: "Basic browser storage can be used to remember navigation preferences and improve site performance.",
                  },
                  {
                    heading: "Analytics",
                    body: "Anonymous analytics may help us understand site usage patterns and improve the user journey.",
                  },
                ]}
                title="Cookie Policy"
              />
            }
            path="cookies"
          />
          <Route
            element={
              <LegalPage
                canonicalPath="/refunds"
                intro="Refunds and cancellation handling depend on the confirmed booking terms, timing, and service allocation."
                sections={[
                  {
                    heading: "Cancellation Timing",
                    body: "The earlier a change is communicated, the more flexible we can usually be with alternative arrangements.",
                  },
                  {
                    heading: "Confirmed Services",
                    body: "Refund treatment may vary depending on whether a vehicle, driver, or custom itinerary has already been committed.",
                  },
                ]}
                title="Refund Policy"
              />
            }
            path="refunds"
          />
          <Route
            element={
              <LegalPage
                canonicalPath="/booking-terms"
                intro="Booking-specific terms cover pickup timing, vehicle category expectations, delivery locations, and final confirmation."
                sections={[
                  {
                    heading: "Availability",
                    body: "Vehicle requests are handled subject to confirmed fleet availability and the final travel schedule shared with our team.",
                  },
                  {
                    heading: "Pickup Coordination",
                    body: "Airport, hotel, and city pickup timing should be confirmed in advance to ensure smooth vehicle handover.",
                  },
                ]}
                title="Booking Terms"
              />
            }
            path="booking-terms"
          />

          <Route element={<Navigate replace to="/404" />} path="404" />
          <Route element={<NotFound />} path="*" />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
