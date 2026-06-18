import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, ChevronDown, X, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";
import { categories, sortOptions, sizes } from "../data/products";

const PRODUCTS_PER_PAGE = 8;

const ShopPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("Toutes");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 600]);
  const [sortBy, setSortBy] = useState("Featured");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showSaleOnly, setShowSaleOnly] = useState(false);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size],
    );
    setCurrentPage(1);
  };

  const { products: allProducts } = useProducts();

  const filteredAndSorted = useMemo(() => {
    let result = [...allProducts];

    // Hide products with empty inventory or zero total stock
    result = result.filter((p) => {
      if (!p.inventory || typeof p.inventory !== "object") return false;
      const totalStock = Object.values(p.inventory).reduce(
        (sum: number, qty) => sum + Number(qty || 0),
        0
      );
      return totalStock > 0;
    });

    if (selectedCategory !== "Toutes") {
      result = result.filter(
        (p) => p.category === selectedCategory.toLowerCase(),
      );
    }

    
    if (selectedSizes.length > 0) {
      result = result.filter((p) =>
        selectedSizes.some((s) => p.sizes.includes(s)),
      );
    }
    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1],
    );
    if (showSaleOnly) {
      result = result.filter((p) => p.isSale);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }

    switch (sortBy) {
  case "Price: Low to High":
    result.sort((a, b) => a.price - b.price);
    break;
  case "Price: High to Low":
    result.sort((a, b) => b.price - a.price);
    break;
  case "Newest":
    result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    break;
  case "Best Sellers":
    result.sort(
      (a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0),
    );
    break;
  default:
    // Default sort: MIDI products first, then others
    result.sort((a, b) => {
      const aIsMidi = a.category?.toLowerCase() === "midi" ? 0 : 1;
      const bIsMidi = b.category?.toLowerCase() === "midi" ? 0 : 1;
      return aIsMidi - bIsMidi;
    });
    break;
}

    return result;
  }, [
    allProducts,
    selectedCategory,
    selectedSizes,
    priceRange,
    sortBy,
    searchQuery,
    showSaleOnly,
  ]);

  const totalPages = Math.ceil(filteredAndSorted.length / PRODUCTS_PER_PAGE);
  const paginated = filteredAndSorted.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const activeFiltersCount =
    (selectedCategory !== "Toutes" ? 1 : 0) +
    selectedSizes.length +
    (showSaleOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedCategory("Toutes");
    setSelectedSizes([]);
    setPriceRange([0, 600]);
    setSortBy("Featured");
    setSearchQuery("");
    setShowSaleOnly(false);
    setCurrentPage(1);
  };

  return (
    <PageTransition>
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 bg-[#1a1a1a] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/32263994/pexels-photo-32263994.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=1400"
          alt="Shop Dresses"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]"
          >
            {t("shop.heroLabel")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-playfair text-4xl md:text-6xl text-white mt-3"
          >
            {t("shop.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="font-inter text-sm text-white/60 mt-3"
          >
            {t("shop.results", { count: filteredAndSorted.length })}
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10">
        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center gap-2 font-inter text-xs uppercase tracking-[0.15em] text-[#1a1a1a] border border-gray-200 px-4 py-2.5 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all md:hidden"
            >
              <SlidersHorizontal size={14} strokeWidth={1.5} />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>

            {/* Desktop Category Pills */}
            <div className="hidden md:flex items-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`font-inter text-[11px] uppercase tracking-[0.15em] px-4 py-2 transition-all duration-200 ${
                    selectedCategory === cat
                      ? "bg-[#1a1a1a] text-white"
                      : "border border-gray-200 text-gray-600 hover:border-[#c9a96e] hover:text-[#c9a96e]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                strokeWidth={1.5}
              />
              <input
                type="text"
                placeholder={t("shop.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2.5 border border-gray-200 font-inter text-sm outline-none focus:border-[#c9a96e] transition-colors w-48 placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X size={12} className="text-gray-400" />
                </button>
              )}
            </div>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="font-inter text-xs text-[#c9a96e] underline underline-offset-4 hover:no-underline"
              >
                {t("shop.clearFilters")}
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="font-inter text-xs text-gray-400 uppercase tracking-widest hidden md:block">
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none border border-gray-200 font-inter text-xs text-gray-600 px-4 py-2.5 pr-8 outline-none focus:border-[#c9a96e] transition-colors cursor-pointer bg-white"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={12}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden md:block w-56 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              {/* Sizes */}
              <div>
                <h3 className="font-inter text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Sizes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => toggleSize(size)}
                      className={`w-10 h-10 font-inter text-xs border transition-all duration-200 ${
                        selectedSizes.includes(size)
                          ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-inter text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  Price: {priceRange[0]} DH — {priceRange[1]} DH
                </h3>
                <input
                  type="range"
                  min={0}
                  max={600}
                  step={25}
                  value={priceRange[1]}
                  onChange={(e) => {
                    setPriceRange([0, Number(e.target.value)]);
                    setCurrentPage(1);
                  }}
                  className="w-full accent-[#c9a96e]"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-inter text-xs text-gray-400">0 DH</span>
                  <span className="font-inter text-xs text-gray-400">600 DH</span>
                </div>
              </div>

              
            </div>
          </div>

          {/* Mobile Filter Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden w-full overflow-hidden"
              >
                <div className="py-6 border-b border-gray-100 space-y-6">
                  <div>
                    <h3 className="font-inter text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setCurrentPage(1);
                          }}
                          className={`font-inter text-xs px-3 py-1.5 border transition-all ${
                            selectedCategory === cat
                              ? "bg-[#1a1a1a] text-white border-[#1a1a1a]"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-inter text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                      Size
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => toggleSize(size)}
                          className={`w-10 h-10 font-inter text-xs border transition-all ${
                            selectedSizes.includes(size)
                              ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                              : "border-gray-200 text-gray-600"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-playfair text-2xl text-gray-300">
                  Aucune pièce trouvée
                </p>
                <p className="font-inter text-sm text-gray-400 mt-2">
                  Essayez de régler vos filtres.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 font-inter text-xs uppercase tracking-[0.15em] text-[#c9a96e] border border-[#c9a96e] px-6 py-3 hover:bg-[#c9a96e] hover:text-white transition-all"
                >
                  Effacer les filtres
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-16">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className={`w-10 h-10 font-inter text-xs transition-all duration-200 ${
                            currentPage === page
                              ? "bg-[#1a1a1a] text-white"
                              : "border border-gray-200 text-gray-600 hover:border-[#c9a96e] hover:text-[#c9a96e]"
                          }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ShopPage;
