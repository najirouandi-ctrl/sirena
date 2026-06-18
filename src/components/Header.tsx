import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Heart, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useWishlist } from "../context/WishlistContext";
import { fetchProducts } from "../api/products";

const navLinksData = [
  { key: "navigation.home", path: "/" },
  { key: "navigation.shop", path: "/shop" },
  { key: "navigation.about", path: "/about" },
  { key: "navigation.contact", path: "/contact" },
];

const Header: React.FC = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems: wishlistCount } = useWishlist();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      const results = allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) =>
            t.toLowerCase().includes(searchQuery.toLowerCase()),
          ),
      );
      setSearchResults(results.slice(0, 4));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, allProducts]);

  useEffect(() => {
    const loadSearchProducts = async () => {
      try {
        const results = await fetchProducts();
        setAllProducts(results);
      } catch (err) {
        console.error(err);
      }
    };

    loadSearchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHome = location.pathname === "/";
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-sm shadow-sm"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className={`flex items-center gap-3 font-playfair text-2xl font-normal tracking-[0.15em] transition-colors duration-300 ${
                isTransparent ? "text-white" : "text-[#1a1a1a]"
              }`}
            >
              <img
                src="https://res.cloudinary.com/dxag5xfm6/image/upload/v1781531026/SL-logo_bfb1ev.png"
                alt={t("common.brand")}
                className="w-10 h-10 object-contain"
              />
              <span>{t("common.brand")}</span>
            </Link>

            {/* Center Nav - Desktop */}
            <nav className="hidden lg:flex items-center gap-10">
              {navLinksData.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-inter text-[11px] uppercase tracking-[0.18em] transition-all duration-300 relative group ${
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-[#1a1a1a] hover:text-[#c9a96e]"
                  } ${location.pathname === link.path ? (isTransparent ? "text-white" : "text-[#c9a96e]") : ""}`}
                >
                  {t(link.key)}
                  <span
                    className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                      isTransparent ? "bg-white" : "bg-[#c9a96e]"
                    } ${location.pathname === link.path ? "w-full" : "w-0 group-hover:w-full"}`}
                  />
                </Link>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-5">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`transition-colors duration-300 ${
                    isTransparent
                      ? "text-white/90 hover:text-white"
                      : "text-[#1a1a1a] hover:text-[#c9a96e]"
                  }`}
                  aria-label="Search"
                >
                  <Search size={19} strokeWidth={1.5} />
                </button>
                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-10 w-80 bg-white shadow-xl border border-gray-100 z-50"
                    >
                      <div className="flex items-center border-b border-gray-100 px-4 py-3">
                        <Search
                          size={15}
                          className="text-gray-400 mr-3"
                          strokeWidth={1.5}
                        />
                        <input
                          autoFocus
                          type="text"
                          placeholder={t("header.search")}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1 text-sm font-inter text-gray-800 outline-none placeholder:text-gray-400"
                        />
                        {searchQuery && (
                          <button onClick={() => setSearchQuery("")}>
                            <X size={14} className="text-gray-400" />
                          </button>
                        )}
                      </div>
                      {searchResults.length > 0 ? (
                        <div className="py-2">
                          {searchResults.map((product) => (
                            <button
                              key={product.id}
                              onClick={() => {
                                navigate(`/products/${product.slug}`);
                                setSearchOpen(false);
                                setSearchQuery("");
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#faf8f5] transition-colors"
                            >
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-10 h-12 object-cover"
                              />
                              <div className="text-left">
                                <p className="text-sm font-inter text-gray-800">
                                  {product.name}
                                </p>
                                <p className="text-xs text-[#c9a96e] font-inter">
                                  {product.price} DH
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : searchQuery.length > 1 ? (
                        <p className="px-4 py-6 text-sm text-gray-400 font-inter text-center">
                          {t("header.noResults")}
                        </p>
                      ) : (
                        <p className="px-4 py-6 text-xs text-gray-400 font-inter text-center uppercase tracking-widest">
                          Start typing to search
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className={`relative transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-[#1a1a1a] hover:text-[#c9a96e]"
                }`}
                aria-label="Wishlist"
              >
                <Heart size={19} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#c9a96e] text-white text-[10px] rounded-full flex items-center justify-center font-inter">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={`lg:hidden transition-colors duration-300 ${
                  isTransparent
                    ? "text-white/90 hover:text-white"
                    : "text-[#1a1a1a] hover:text-[#c9a96e]"
                }`}
                aria-label="Menu"
              >
                {mobileOpen ? (
                  <X size={21} strokeWidth={1.5} />
                ) : (
                  <Menu size={21} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed top-20 left-4 z-40 bg-[#FAF7EF] rounded-lg w-72 shadow-lg border border-gray-100 flex flex-col"
          >
            <header className="h-14 flex items-center justify-between px-4 bg-transparent">
              <button
                onClick={() => setMobileOpen(false)}
                className="transition-colors duration-200 text-[#1a1a1a]"
                aria-label="Close menu"
              >
                <X size={22} strokeWidth={1.5} />
              </button>

              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 font-playfair text-2xl text-[#1a1a1a]"
              >
                <img
                  src="https://res.cloudinary.com/dxag5xfm6/image/upload/v1781531026/SL-logo_bfb1ev.png"
                  alt={t("common.brand")}
                  className="w-10 h-10 object-contain"
                />
                <span>{t("common.brand")}</span>
              </Link>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setSearchOpen(!searchOpen);
                    setMobileOpen(false);
                  }}
                  className="transition-colors duration-200 text-[#1a1a1a]"
                  aria-label="Search"
                >
                  <Search size={18} strokeWidth={1.5} />
                </button>

                <Link
                  to="/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="relative transition-colors duration-200 text-[#1a1a1a]"
                  aria-label="Wishlist"
                >
                  <Heart size={18} strokeWidth={1.5} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-[#c9a96e] text-white text-[10px] rounded-full flex items-center justify-center font-inter">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
              </div>
            </header>

            <nav className="flex flex-col items-start gap-4 p-4 font-poppins text-sm">
              {navLinksData.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                >
                  <Link
                    to={link.path}
                    className={`font-poppins text-base font-medium tracking-wide transition-colors ${
                      location.pathname === link.path
                        ? "text-[#c9a96e]"
                        : "text-[#1a1a1a]"
                    }`}
                  >
                    {t(link.key)}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="px-4 pb-4">
              <p className="font-inter text-xs text-gray-400 uppercase tracking-[0.2em]">
                {t("common.brand")}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
