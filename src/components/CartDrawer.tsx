import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";

const CartDrawer: React.FC = () => {
  const { t } = useTranslation();
  const {
    items,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
    totalItems,
  } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-white z-[70] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#1a1a1a]"
                />
                <h2 className="font-playfair text-lg text-[#1a1a1a]">
                  {t("cart.yourBag")}{" "}
                  {totalItems > 0 && (
                    <span className="text-[#c9a96e]">({totalItems})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-[#1a1a1a] transition-colors"
                aria-label={t("cart.closeCart")}
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <ShoppingBag
                    size={48}
                    strokeWidth={1}
                    className="text-gray-200"
                  />
                  <p className="font-playfair text-lg text-gray-400">
                    {t("cart.empty")}
                  </p>
                  <p className="font-inter text-sm text-gray-400">
                    {t("cart.emptyDescription")}
                  </p>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-4 font-inter text-xs uppercase tracking-[0.15em] text-[#c9a96e] border border-[#c9a96e] px-6 py-3 hover:bg-[#c9a96e] hover:text-white transition-all duration-300"
                  >
                    {t("cart.continueShopping")}
                  </button>
                </div>
              ) : (
                <div className="space-y-6 py-2">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={`${item.product.id}-${item.size}-${item.color}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4"
                      >
                        <Link
                          to={`/products/${item.product.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="w-24 h-32 flex-shrink-0 overflow-hidden bg-gray-50"
                        >
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/products/${item.product.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="font-playfair text-sm text-[#1a1a1a] hover:text-[#c9a96e] transition-colors leading-snug line-clamp-2"
                          >
                            {item.product.name}
                          </Link>
                          <div className="flex gap-3 mt-1">
                            <span className="font-inter text-xs text-gray-400">
                              {item.size}
                            </span>
                            <span className="font-inter text-xs text-gray-400">
                              {item.color}
                            </span>
                          </div>
                          <p className="font-inter text-sm text-[#c9a96e] mt-1">
                            ${item.product.price}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center border border-gray-200">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.size,
                                    item.color,
                                    item.quantity - 1,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center font-inter text-xs text-gray-700">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.size,
                                    item.color,
                                    item.quantity + 1,
                                  )
                                }
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <button
                              onClick={() =>
                                removeFromCart(
                                  item.product.id,
                                  item.size,
                                  item.color,
                                )
                              }
                              className="text-gray-300 hover:text-red-400 transition-colors"
                              aria-label={t("cart.removeItem")}
                            >
                              <Trash2 size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-inter text-sm text-gray-500">
                    {t("cart.subtotal")}
                  </span>
                  <span className="font-playfair text-lg text-[#1a1a1a]">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="font-inter text-xs text-gray-400">
                  {t("cart.taxesInfo")}
                </p>
                <button className="w-full bg-[#1a1a1a] text-white font-inter text-xs uppercase tracking-[0.15em] py-4 hover:bg-[#c9a96e] transition-all duration-300">
                  {t("cart.checkout")}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full border border-gray-200 text-[#1a1a1a] font-inter text-xs uppercase tracking-[0.15em] py-3 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all duration-300"
                >
                  {t("cart.continueShopping")}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
