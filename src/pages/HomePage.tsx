import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import PageTransition from "../components/PageTransition";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../hooks/useProducts";

const heroImage = "https://res.cloudinary.com/dxag5xfm6/image/upload/v1781793347/hero-img_urapun.jpg";

const instagramImages = [
  "https://images.unsplash.com/photo-1762341545072-9a69cc0cfcee?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1733043016110-5baf4fb6b579?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1762154057377-cc9d3dd6900c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  const { products: allProducts } = useProducts();
  
  const featuredIds = ["1", "2", "3", "4"];
  const latestProducts = featuredIds
  .map(id => allProducts.find(p => p.id === id))
  .filter(Boolean);

  return (
    <PageTransition>
      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative h-screen min-h-[700px] overflow-hidden"
      >
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={heroImage}
            alt="Siréna — Mode de Luxe"
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        </motion.div>

        <motion.div
          className="relative h-full flex flex-col items-center justify-center text-center text-white px-6"
          style={{ opacity: heroOpacity }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="font-playfair text-5xl md:text-7xl lg:text-8xl font-normal leading-[1.05] max-w-4xl"
          >
            {t("hero.mainTitleHighlight")}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Link
              to="/shop"
              className="group flex items-center gap-3 bg-white text-[#1a1a1a] font-inter text-xs uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#c9a96e] hover:text-white transition-all duration-400"
            >
              {t("hero.ctaShop")}
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-inter text-[9px] uppercase tracking-[0.3em] text-white/50">
            {t("hero.scroll")}
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown
              size={16}
              className="text-white/50"
              strokeWidth={1.5}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* MARQUEE */}
      <div className="bg-[#1a1a1a] py-4 overflow-hidden">
        <motion.div
          animate={{ x: [0, -1200] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex items-center gap-12 whitespace-nowrap"
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/60">
                {t("marquee.newCollection")}
              </span>
              <span className="text-[#c9a96e]">✦</span>
              <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/60">
                {t("marquee.freeShipping")}
              </span>
              <span className="text-[#c9a96e]">✦</span>
              <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-white/60">
                {t("marquee.exclusive")}
              </span>
              <span className="text-[#c9a96e]">✦</span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* FEATURED COLLECTION */}
      <section className="py-24 px-6 lg:px-10 max-w-[1400px] mx-auto">
        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
            {t("home.featuredLabel")}
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl text-[#1a1a1a] mt-3">
            {t("home.featuredTitle")}
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
            {t("home.featuredDescription")}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {latestProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <motion.div
          {...fadeInUp}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-14"
        >
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 font-inter text-xs uppercase tracking-[0.2em] text-[#1a1a1a] border border-[#1a1a1a] px-8 py-4 hover:bg-[#1a1a1a] hover:text-white transition-all duration-400"
          >
            View All Dresses
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-24 bg-[#1a1a1a] text-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div>
              <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                {t("home.instagramHandle")}
              </span>
              <h2 className="font-playfair text-4xl mt-4">
                {t("home.instagramTitle")}
              </h2>
              <p className="font-inter text-sm text-white/70 mt-4 max-w-xl leading-relaxed">
                {t("home.instagramSubtitle")}
              </p>
            </div>

            <Link
              target="_blank"
              to="https://www.instagram.com/sirena.ls"
              className="inline-flex items-center gap-3 font-inter text-xs uppercase tracking-[0.2em] border border-white/20 px-6 py-3 hover:bg-white hover:text-[#1a1a1a] transition-all duration-400"
            >
              {t("Suivez-nous")}
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
            {instagramImages.map((src, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden rounded-2xl"
              >
                <img
                  src={src}
                  alt={`Instagram image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND VALUES */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <motion.div {...fadeInUp} className="mb-14">
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                  {t("home.valuesLabel")}
                </span>
                <h2 className="font-playfair text-4xl md:text-5xl text-[#1a1a1a] mt-4">
                  {t("home.valuesTitle")}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="border border-gray-100 p-8">
                  <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e]">
                    {t("home.valueOneTitle")}
                  </span>
                  <p className="font-playfair text-2xl text-[#1a1a1a] mt-4">
                    {t("home.valueOneDesc")}
                  </p>
                </div>
                <div className="border border-gray-100 p-8">
                  <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e]">
                    {t("home.valueTwoTitle")}
                  </span>
                  <p className="font-playfair text-2xl text-[#1a1a1a] mt-4">
                    {t("home.valueTwoDesc")}
                  </p>
                </div>
                <div className="border border-gray-100 p-8">
                  <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e]">
                    {t("home.valueThreeTitle")}
                  </span>
                  <p className="font-playfair text-2xl text-[#1a1a1a] mt-4">
                    {t("home.valueThreeDesc")}
                  </p>
                </div>
                <div className="border border-gray-100 p-8">
                  <span className="font-inter text-[11px] uppercase tracking-[0.2em] text-[#c9a96e]">
                    {t("home.valueFourTitle")}
                  </span>
                  <p className="font-playfair text-2xl text-[#1a1a1a] mt-4">
                    {t("home.valueFourDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#f7f2ed] p-10 rounded-[32px] border border-[#e6d7c8]">
              <motion.div {...fadeInUp}>
                <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                  {t("home.newsletterLabel")}
                </span>
                <h2 className="font-playfair text-4xl text-[#1a1a1a] mt-4">
                  {t("home.newsletterTitle")}
                </h2>
                <p className="font-inter text-sm text-[#4f4f4f] mt-6 leading-relaxed">
                  {t("home.newsletterDescription")}
                </p>
                <form className="mt-10 flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    placeholder={t("home.newsletterPlaceholder")}
                    className="w-full rounded-full border border-[#d9d1c3] bg-white/90 px-6 py-4 font-inter text-sm text-[#1a1a1a] outline-none focus:border-[#c9a96e] transition-all"
                  />
                  <button className="rounded-full bg-[#1a1a1a] text-white px-10 py-4 font-inter text-xs uppercase tracking-[0.2em] hover:bg-[#c9a96e] transition-all">
                    {t("home.newsletterSubscribe")}
                  </button>
                </form>
                <p className="font-inter text-xs text-[#7f7f7f] mt-4 max-w-xs">
                  {t("home.newsletterPrivacy")}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
};

export default HomePage;
