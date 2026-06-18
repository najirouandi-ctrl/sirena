import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import { useWishlist } from "../context/WishlistContext";
import { createWhatsAppLink, createWhatsAppMessage } from "../utils/whatsapp";

const WishlistPage: React.FC = () => {
  const { t } = useTranslation();
  const { items, removeFromWishlist } = useWishlist();

  return (
    <PageTransition>
      <div className="pt-32 pb-20 px-6 lg:px-10 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
              {t("wishlist.yourCollection")}
            </span>
            <h1 className="font-playfair text-5xl text-[#1a1a1a] mt-3">
              {t("wishlist.title")}
            </h1>
            <p className="font-inter text-sm text-gray-400 mt-3">
              {t("wishlist.pieces", { count: items.length })}
            </p>
          </motion.div>
        </div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Heart
              size={60}
              strokeWidth={1}
              className="text-gray-200 mx-auto"
            />
            <h2 className="font-playfair text-2xl text-gray-300 mt-6">
              {t("wishlist.empty")}
            </h2>
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 mt-8 font-inter text-xs uppercase tracking-[0.15em] bg-[#1a1a1a] text-white px-8 py-4 hover:bg-[#c9a96e] transition-all duration-400"
            >
              <ShoppingBag size={14} strokeWidth={1.5} />
              {t("cart.continueShopping")}
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              <AnimatePresence>
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-[#faf8f5]">
                      <Link to={`/products/${product.slug}`}>
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white flex items-center justify-center text-rose-400 hover:bg-rose-50 transition-colors shadow-sm"
                        aria-label="Remove from wishlist"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                      </button>
                    </div>
                    <div className="pt-4">
                      <Link to={`/products/${product.slug}`}>
                        <h3 className="font-playfair text-[15px] text-[#1a1a1a] hover:text-[#c9a96e] transition-colors">
                          {product.name}
                        </h3>
                      </Link>
                      <p className="font-inter text-sm text-gray-500 mt-1">
                        {product.price} DH
                      </p>
                      <button
                        onClick={() => {
                          const productUrl = `${window.location.origin}/products/${product.slug}`;
                          const message = createWhatsAppMessage({
                            name: product.name,
                            price: product.price,
                            size: product.sizes[0] || "N/A",
                            quantity: 1,
                            color: product.colors[0] || undefined,
                            productUrl,
                          });
                          window.open(createWhatsAppLink(message), "_blank");
                        }}
                        className="flex items-center gap-2 w-full justify-center font-inter text-[11px] uppercase tracking-[0.15em] border border-gray-200 text-gray-600 py-2.5 mt-3 hover:border-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-300"
                      >
                        <MessageSquare size={13} strokeWidth={1.5} />
                        Commander via WhatsApp
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="text-center mt-16">
              <Link
                to="/shop"
                className="group inline-flex items-center gap-2 font-inter text-xs uppercase tracking-[0.2em] border border-gray-200 text-gray-600 px-8 py-4 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all"
              >
                {t("cart.continueShopping")}
                <ArrowRight
                  size={13}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
};

export default WishlistPage;
