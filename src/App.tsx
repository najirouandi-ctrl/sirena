import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WishlistProvider } from "./context/WishlistContext";
import { RecentlyViewedProvider } from "./context/RecentlyViewedContext";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import WishlistPage from "./pages/WishlistPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";
import AdminPage from "./pages/AdminPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <WishlistProvider>
        <RecentlyViewedProvider>
          <Routes>
            {/* ── Routes avec le header/footer du site ── */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="products/:slug" element={<ProductPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="wishlist" element={<WishlistPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* ── Admin : sans MainLayout, donc sans header/footer du site ── */}
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </RecentlyViewedProvider>
      </WishlistProvider>
    </BrowserRouter>
  );
};

export default App;