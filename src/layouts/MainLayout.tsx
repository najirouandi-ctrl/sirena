import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import BackToTop from "../components/BackToTop";
import WhatsAppFloatingButton from "../components/WhatsAppFloatingButton";

const MainLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait" initial={false}>
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
      <BackToTop />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default MainLayout;
