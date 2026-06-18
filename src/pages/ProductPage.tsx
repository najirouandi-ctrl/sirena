import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  MessageSquare,
  Star,
  ChevronRight,
  Minus,
  Plus,
  ChevronDown,
  Share2,
  Truck,
  RotateCcw,
} from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { fetchProductBySlug, getRelatedProducts } from "../api/products";
import { Product } from "../data/products";
import { useWishlist } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { createWhatsAppLink, createWhatsAppMessage } from "../utils/whatsapp";

const ProductPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addRecentlyViewed, items: recentItems } = useRecentlyViewed();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await fetchProductBySlug(slug);
      setProduct(data);
      setLoading(false);
    };

    loadProduct();
  }, [slug]);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]);
      setSelectedSize("");
      setSelectedImage(0);
      addRecentlyViewed(product);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [product?.id]);

  useEffect(() => {
    const loadRelated = async () => {
      if (!product) return;
      const related = await getRelatedProducts(product, 4);
      setRelatedProducts(related);
    };

    loadRelated();
  }, [product]);

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="font-playfair text-3xl text-gray-300">
            Chargement du produit...
          </p>
        </div>
      </PageTransition>
    );
  }

  if (!product) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col items-center justify-center pt-20">
          <p className="font-playfair text-3xl text-gray-300">
            Product not found
          </p>
          <Link
            to="/shop"
            className="mt-6 font-inter text-xs uppercase tracking-widest text-[#c9a96e] border border-[#c9a96e] px-6 py-3 hover:bg-[#c9a96e] hover:text-white transition-all"
          >
            Back to Shop
          </Link>
        </div>
      </PageTransition>
    );
  }

  const recentlyViewed = recentItems
    .filter((p) => p.id !== product.id)
    .slice(0, 4);
  const wishlisted = product ? isWishlisted(product.id) : false;

  const handleOrderViaWhatsApp = () => {
    if (!selectedSize || !product) return;
    const productUrl = window.location.href;
    const message = createWhatsAppMessage({
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity,
      color: selectedColor,
      productUrl,
    });
    window.open(createWhatsAppLink(message), "_blank");
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      // Optional success message
      alert("Product link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const accordionItems = [
    {
      id: "details",
      title: "Détails du produit",
      content: (
        <div>
          <p className="font-inter text-sm text-gray-600 leading-relaxed">
            {product.longDescription}
          </p>
          <div className="mt-4 space-y-1">
            <p className="font-inter text-sm text-gray-600">
              <span className="text-[#1a1a1a] font-medium">Catégorie:</span>{" "}
              {product.category.charAt(0).toUpperCase() +
                product.category.slice(1)}{" "}
              Robe
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "shipping",
      title: "EXPÉDITION & Livraison",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <p className="font-inter text-sm text-gray-600">
              Chez Siréna, la livraison est entièrement gratuite sur
              toutes les commandes. Chaque colis est préparé avec soin et
              expédié dans les meilleurs délais afin de garantir une expérience
              rapide, fiable et sécurisée. Nous mettons tout en œuvre pour que
              vos pièces arrivent chez vous dans un état impeccable.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "returns",
      title: "Retours & Échanges",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <p className="font-inter text-sm text-gray-600">
              Nous souhaitons que chaque cliente soit pleinement satisfaite de
              son achat. Si un article ne vous convient pas, vous pouvez
              demander un échange selon nos conditions en vigueur. Les retours
              sont traités avec soin et dans les meilleurs délais. Notre service
              client reste à votre écoute pour vous accompagner à chaque étape.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "care",
      title: "Instructions de Entretien",
      content: (
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <p className="font-inter text-sm text-gray-600">
              Pour préserver la qualité et la durabilité de vos pièces Siréna By
              S&L, nous recommandons un entretien délicat adapté à chaque
              vêtement. Privilégiez un lavage doux ou un nettoyage professionnel
              lorsque cela est nécessaire, et évitez les températures élevées
              afin de conserver la texture, la couleur et l’élégance des tissus.
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageTransition>
      <div className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4">
          <nav className="flex items-center gap-2 font-inter text-xs text-gray-400">
            <Link to="/" className="hover:text-[#c9a96e] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/shop" className="hover:text-[#c9a96e] transition-colors">
              Shop
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#1a1a1a]">{product.name}</span>
          </nav>
        </div>

        {/* Product Layout */}
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div
                className="relative aspect-[3/4] overflow-hidden bg-[#faf8f5] cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                <motion.img
                  key={selectedImage}
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={
                    isZoomed
                      ? {
                          transform: "scale(1.8)",
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : { transform: "scale(1)" }
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {product.isNew && (
                    <span className="bg-[#1a1a1a] text-white font-inter text-[9px] uppercase tracking-[0.15em] px-3 py-1.5">
                      New
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="bg-[#c9a96e] text-white font-inter text-[9px] uppercase tracking-[0.15em] px-3 py-1.5">
                      Bestseller
                    </span>
                  )}
                  {product.isSale && (
                    <span className="bg-rose-500 text-white font-inter text-[9px] uppercase tracking-[0.15em] px-3 py-1.5">
                      Sale
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-[3/4] overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === i
                        ? "border-[#c9a96e]"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="lg:pt-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {/* Category + Share */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-inter text-[10px] uppercase tracking-[0.25em] text-[#c9a96e]">
                    
                  </span>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-1 text-gray-400 hover:text-[#c9a96e] transition-colors cursor-pointer"
                    aria-label="Share"
                  >
                    <Share2 size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Title */}
                <h1 className="font-playfair text-3xl md:text-4xl text-[#1a1a1a] leading-tight">
                  {product.name}
                </h1>

                {/* Rating */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} fill="#20B857" strokeWidth={0} />
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3 mt-5">
                  <span className="font-playfair text-3xl text-[#1a1a1a]">
                    {product.price} DH
                  </span>
                  {product.originalPrice && (
                    <span className="font-inter text-base text-gray-400 line-through">
                      {product.originalPrice} DH
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="font-inter text-xs text-rose-500">
                      Save {product.originalPrice - product.price} DH
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="font-inter text-sm text-gray-500 mt-5 leading-relaxed border-t border-gray-100 pt-5">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mt-6">
                  <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 mb-3">
                    Colour:{" "}
                    <span className="text-[#1a1a1a] normal-case">
                      {selectedColor}
                    </span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`font-inter text-xs px-4 py-2 border transition-all duration-200 ${
                          selectedColor === color
                            ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                            : "border-gray-200 text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500">
                      Taille{" "}
                      {!selectedSize && (
                        <span className="text-rose-400 normal-case tracking-normal text-[11px] ml-1">
                          — Veuillez choisir
                        </span>
                      )}
                    </p>
                    <a
                      target="_blank"
                      href="https://simplicity.com/content/downloads/French_Sizing.pdf"
                      className="font-inter text-[11px] uppercase tracking-widest text-[#c9a96e] underline underline-offset-4 hover:no-underline"
                    >
                      Size Guide
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 font-inter text-xs border transition-all duration-200 ${
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

                {/* Quantity */}
                <div className="mt-6">
                  <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 mb-3">
                    Quantité
                  </p>
                  <div className="flex items-center border border-gray-200 w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-all"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-12 text-center font-inter text-sm text-gray-700">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#1a1a1a] hover:bg-gray-50 transition-all"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-8">
                  <motion.button
                    onClick={handleOrderViaWhatsApp}
                    disabled={!selectedSize}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 flex items-center justify-center gap-2 font-inter text-xs uppercase tracking-[0.2em] py-4 transition-all duration-400 ${
                      !selectedSize
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-[#1a1a1a] text-white hover:bg-[#c9a96e]"
                    }`}
                  >
                    <MessageSquare size={16} strokeWidth={1.5} />
                    Commander via WhatsApp
                  </motion.button>
                  <motion.button
                    onClick={() => toggleWishlist(product)}
                    whileTap={{ scale: 0.95 }}
                    className={`w-14 h-14 border flex items-center justify-center transition-all duration-200 ${
                      wishlisted
                        ? "border-[#c9a96e] bg-[#c9a96e]/10 text-[#c9a96e]"
                        : "border-gray-200 text-gray-400 hover:border-[#c9a96e] hover:text-[#c9a96e]"
                    }`}
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      className={wishlisted ? "fill-[#c9a96e]" : ""}
                    />
                  </motion.button>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center gap-6 mt-6 py-5 border-t border-gray-100">
                  {[
                    { Icon: Truck, text: "Livraison gratuite" },
                    { Icon: RotateCcw, text: "Retours sous 14 jours" },
                    { Icon: MessageSquare, text: "Commander via WhatsApp" },
                  ].map(({ Icon, text }) => (
                    <div key={text} className="flex items-center gap-2">
                      <Icon
                        size={14}
                        className="text-[#c9a96e]"
                        strokeWidth={1.5}
                      />
                      <span className="font-inter text-[11px] text-gray-500">
                        {text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Accordion */}
                <div className="border-t border-gray-100 mt-2">
                  {accordionItems.map((item) => (
                    <div key={item.id} className="border-b border-gray-100">
                      <button
                        onClick={() =>
                          setOpenAccordion(
                            openAccordion === item.id ? null : item.id,
                          )
                        }
                        className="w-full flex items-center justify-between py-4"
                      >
                        <span className="font-inter text-[11px] uppercase tracking-[0.15em] text-[#1a1a1a]">
                          {item.title}
                        </span>
                        <motion.div
                          animate={{
                            rotate: openAccordion === item.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown size={15} className="text-gray-400" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {openAccordion === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="pb-5 pr-4">{item.content}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-[#faf8f5] py-20 px-6 lg:px-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-12">
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                  You May Also Like
                </span>
                <h2 className="font-playfair text-3xl text-[#1a1a1a] mt-2">
                  Related Pieces
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <section className="py-20 px-6 lg:px-10">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-12">
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                  Continue Browsing
                </span>
                <h2 className="font-playfair text-3xl text-[#1a1a1a] mt-2">
                  Recently Viewed
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {recentlyViewed.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </PageTransition>
  );
};

export default ProductPage;
