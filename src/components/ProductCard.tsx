import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Eye } from 'lucide-react';
import { Product } from '../data/products';
import { useWishlist } from '../context/WishlistContext';
import QuickViewModal from './QuickViewModal';

interface ProductCardProps {
  product: Product;
  index?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0 }) => {
  const [hovered, setHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: index * 0.08, ease: 'easeOut' }}
        className="group relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-[#faf8f5] aspect-[3/4]">
          {/* Primary Image */}
          <Link to={`/products/${product.slug}`}>
            <motion.img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover absolute inset-0 transition-all duration-700"
              style={{ opacity: hovered && product.images[1] ? 0 : (imageLoaded ? 1 : 0) }}
              onLoad={() => setImageLoaded(true)}
            />
            {/* Secondary Image on hover */}
            {product.images[1] && (
              <motion.img
                src={product.images[1]}
                alt={product.name}
                className="w-full h-full object-cover absolute inset-0 transition-all duration-700"
                style={{ opacity: hovered ? 1 : 0 }}
              />
            )}
            {/* Overlay */}
            <div
              className="absolute inset-0 bg-black/5 transition-opacity duration-500"
              style={{ opacity: hovered ? 1 : 0 }}
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.isNew && (
              <span className="bg-[#1a1a1a] text-white font-inter text-[9px] uppercase tracking-[0.15em] px-2.5 py-1">
                New
              </span>
            )}
            {product.isBestSeller && (
              <span className="bg-[#c9a96e] text-white font-inter text-[9px] uppercase tracking-[0.15em] px-2.5 py-1">
                Bestseller
              </span>
            )}
            {product.isSale && (
              <span className="bg-rose-500 text-white font-inter text-[9px] uppercase tracking-[0.15em] px-2.5 py-1">
                Sale
              </span>
            )}
          </div>

          {/* Actions */}
          <div
            className="absolute right-3 top-3 flex flex-col gap-2 z-10 transition-all duration-300"
            style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(10px)' }}
          >
            <motion.button
              onClick={() => toggleWishlist(product)}
              whileTap={{ scale: 0.9 }}
              className={`w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-[#c9a96e] group/btn transition-colors duration-200 ${
                wishlisted ? 'bg-[#c9a96e]' : ''
              }`}
              aria-label="Add to wishlist"
            >
              <Heart
                size={15}
                strokeWidth={1.5}
                className={`transition-colors ${wishlisted ? 'text-white fill-white' : 'text-gray-600 group-hover/btn:text-white'}`}
              />
            </motion.button>
            <motion.button
              onClick={() => setQuickViewOpen(true)}
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 bg-white flex items-center justify-center shadow-sm hover:bg-[#c9a96e] group/btn transition-colors duration-200"
              aria-label="Quick view"
            >
              <Eye size={15} strokeWidth={1.5} className="text-gray-600 group-hover/btn:text-white transition-colors" />
            </motion.button>
          </div>

          {/* Quick Add */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-3 px-4 flex items-center justify-between transition-all duration-400"
            style={{
              transform: hovered ? 'translateY(0)' : 'translateY(100%)',
              opacity: hovered ? 1 : 0,
            }}
          >
            <span className="font-inter text-[10px] uppercase tracking-[0.15em] text-gray-500">
              Choisissez la taille
            </span>
            <div className="flex gap-1.5">
              {product.sizes.slice(0, 4).map(size => (
                <Link
                  key={size}
                  to={`/products/${product.slug}`}
                  className="w-7 h-7 border border-gray-200 flex items-center justify-center font-inter text-[10px] text-gray-600 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-colors"
                >
                  {size}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2">
          <Link to={`/products/${product.slug}`} className="block group/link">
            <h3 className="font-playfair text-[15px] text-[#1a1a1a] group-hover/link:text-[#c9a96e] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>
          <p className="font-inter text-xs text-gray-400 mt-1 line-clamp-1">{product.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="font-inter text-sm text-[#1a1a1a]">{product.price} DH</span>
            {product.originalPrice && (
              <span className="font-inter text-xs text-gray-400 line-through">${product.originalPrice}</span>
            )}
          </div>
        </div>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
};

export default ProductCard;
