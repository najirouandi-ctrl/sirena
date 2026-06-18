import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { createWhatsAppLink, createWhatsAppMessage } from "../utils/whatsapp";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { isWishlisted, toggleWishlist } = useWishlist();

  const handleOrderViaWhatsApp = () => {
    if (!selectedSize) return;
    const productUrl = `${window.location.origin}/products/${product.slug}`;
    const message = createWhatsAppMessage({
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: 1,
      color: selectedColor,
      productUrl,
    });
    window.open(createWhatsAppLink(message), "_blank");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/50 z-[80] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[780px] md:max-h-[90vh] bg-white z-[90] overflow-y-auto shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 bg-white/80 backdrop-blur flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] transition-colors"
              aria-label="Close"
            >
              <X size={18} strokeWidth={1.5} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image */}
              <div className="aspect-[3/4] md:aspect-auto md:h-full overflow-hidden bg-[#faf8f5]">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="p-8 flex flex-col justify-center">
                <span className="font-inter text-[10px] uppercase tracking-[0.2em] text-[#c9a96e]">
                  {product.category}
                </span>
                <h2 className="font-playfair text-2xl text-[#1a1a1a] mt-2">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < Math.floor(product.rating)
                            ? "text-[#c9a96e] fill-[#c9a96e]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>
                  <span className="font-inter text-xs text-gray-400">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-3">
                  <span className="font-playfair text-xl text-[#1a1a1a]">
                    {product.price} DH
                  </span>
                  {product.originalPrice && (
                    <span className="font-inter text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  )}
                </div>

                <p className="font-inter text-sm text-gray-500 mt-4 leading-relaxed">
                  {product.description}
                </p>

                {/* Color */}
                <div className="mt-5">
                  <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Color:{" "}
                    <span className="text-[#1a1a1a]">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`font-inter text-xs px-3 py-1.5 border transition-all duration-200 ${
                          selectedColor === color
                            ? "border-[#c9a96e] text-[#c9a96e] bg-[#c9a96e]/5"
                            : "border-gray-200 text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="mt-5">
                  <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 mb-2">
                    Size:{" "}
                    {!selectedSize && (
                      <span className="text-rose-400 normal-case tracking-normal">
                        Please select
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-10 h-10 font-inter text-xs border transition-all duration-200 ${
                          selectedSize === size
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleOrderViaWhatsApp}
                    className={`flex-1 flex items-center justify-center gap-2 font-inter text-xs uppercase tracking-[0.15em] py-4 transition-all duration-300 ${
                      selectedSize
                        ? "bg-[#1a1a1a] text-white hover:bg-[#c9a96e]"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <MessageSquare size={15} strokeWidth={1.5} />
                    Commander via WhatsApp
                  </button>
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`w-12 h-12 border flex items-center justify-center transition-all duration-200 ${
                      isWishlisted(product.id)
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "border-gray-200 text-gray-500 hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.5}
                      className={
                        isWishlisted(product.id) ? "fill-[#c9a96e]" : ""
                      }
                    />
                  </button>
                </div>

                <Link
                  to={`/products/${product.slug}`}
                  onClick={onClose}
                  className="mt-4 font-inter text-xs text-center text-[#c9a96e] underline underline-offset-4 hover:no-underline transition-all"
                >
                  View Full Details
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
