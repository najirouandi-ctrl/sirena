import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PageTransition from "../components/PageTransition";

const heroImg =
  "https://res.cloudinary.com/dxag5xfm6/image/upload/v1781888958/WhatsApp_Image_2026-06-18_at_17.48.12_drvlbk.jpg";
const storyImg =
  "https://images.unsplash.com/photo-1584998316204-3b1e3b1895ae?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const missionImg =
  "https://images.unsplash.com/photo-1643934362440-5dc2c80ccd2b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const, margin: "-60px" },
};

const values = [
  {
    number: "01",
    title: "Quality",
    description:
      "We carefully select every item to guarantee satisfaction and elegance.",
  },
  {
    number: "02",
    title: "Trust",
    description:
      "We place our customers satisfaction at the heart of our priorities.",
  },
  {
    number: "03",
    title: "Elegance",
    description:
      "We offer clothing that showcases femininity with sophistication.",
  },
  {
    number: "04",
    title: "Connection",
    description:
      "We maintain a relationship of trust and listening with our community.",
  },
];

const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Full-screen Hero */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={heroImg}
          alt="About Siréna"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-inter text-[10px] uppercase tracking-[0.35em] text-[#c9a96e]"
            >
              Our Story
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-playfair text-5xl md:text-7xl text-white mt-4 leading-[1.05] max-w-2xl"
            >
              About
              <br />
              <em className="italic">Siréna</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="font-inter text-sm text-white/65 mt-6 max-w-md leading-relaxed"
            >
              Founded in 2024, SIRÉNA was created with a vision: to offer
              timeless, elegant pieces designed for the modern woman.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-24 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeInUp}>
            <span className="font-playfair text-[80px] text-[#c9a96e]/20 leading-none block">
              "
            </span>
            <p className="font-playfair text-2xl md:text-3xl text-[#1a1a1a] -mt-8 leading-relaxed italic">
              Inspired by both timeless fashion and contemporary trends, our
              collections are made to elevate everyday moments with effortless
              sophistication.
            </p>
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="h-px w-12 bg-[#c9a96e]" />
              <span className="font-inter text-xs uppercase tracking-[0.2em] text-gray-500">
                Siréna Manager
              </span>
              <div className="h-px w-12 bg-[#c9a96e]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                Our Story
              </span>
              <h2 className="font-playfair text-4xl md:text-5xl text-[#1a1a1a] mt-4 leading-tight">
                Born from a Vision
                <br />
                <em className="italic">of Pure Elegance</em>
              </h2>
              <div className="w-12 h-px bg-[#c9a96e] my-8" />
              <div className="space-y-4 font-inter text-sm text-gray-500 leading-relaxed">
                <p>
                  Founded in 2024, SIRÉNA was created with a vision: to offer
                  timeless, elegant pieces designed for the modern woman. We are
                  based in Marrakech, Morocco.
                </p>
                <p>
                  Inspired by both timeless fashion and contemporary trends, our
                  collections are made to elevate everyday moments with
                  effortless sophistication. Each creation is thoughtfully
                  designed to highlight natural beauty, combining refined
                  details, quality fabrics, and timeless silhouettes.
                </p>
                <p>
                  SIRÉNA is made for women who embrace elegance in their
                  everyday life—confident, graceful, and effortlessly stylish.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={storyImg}
                  alt="Our Story"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white border border-[#e8dfd0] p-6 hidden lg:block shadow-lg">
                <p className="font-playfair text-xl text-[#1a1a1a]">
                  Marrakech
                </p>
                <p className="font-inter text-xs text-[#c9a96e] uppercase tracking-widest mt-1">
                  Morocco · 2024
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-[#1a1a1a]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={missionImg}
                  alt="Our Mission"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2"
            >
              <div className="space-y-12">
                <div>
                  <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                    Crafted With Intention
                  </span>
                  <h2 className="font-playfair text-3xl text-white mt-3">
                    Each creation is thoughtfully designed to highlight natural
                    beauty, combining refined details, quality fabrics, and
                    timeless silhouettes.
                  </h2>
                </div>
                <div className="border-t border-white/10 pt-12">
                  <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
                    For the Modern Woman
                  </span>
                  <h2 className="font-playfair text-3xl text-white mt-3">
                    SIRÉNA is made for women who embrace elegance in their
                    everyday life—confident, graceful, and effortlessly stylish.
                  </h2>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]">
              What We Believe In
            </span>
            <h2 className="font-playfair text-4xl md:text-5xl text-[#1a1a1a] mt-3">
              Our Values
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {values.map((value, i) => (
              <motion.div
                key={value.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex gap-6"
              >
                <span className="font-playfair text-4xl text-[#c9a96e]/25 leading-none flex-shrink-0">
                  {value.number}
                </span>
                <div>
                  <h3 className="font-playfair text-xl text-[#1a1a1a]">
                    {value.title}
                  </h3>
                  <p className="font-inter text-base text-gray-500 mt-2 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#faf8f5] py-20 px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "2024", label: "Founded in Marrakech" },
              {
                value: "Online Shop",
                label: "Carefully selected women's fashion",
              },
              { value: "Satisfaction", label: "Women across Morocco" },
              {
                value: "100%",
                label: "Quality selection with cash on delivery",
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <p className="font-playfair text-4xl md:text-5xl text-[#1a1a1a]">
                  {stat.value}
                </p>
                <p className="font-inter text-xs text-gray-400 uppercase tracking-[0.15em] mt-2">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <motion.div {...fadeInUp}>
          <h2 className="font-playfair text-4xl md:text-5xl text-[#1a1a1a]">
            Discover the Collection
          </h2>
          <p className="font-inter text-sm text-gray-400 mt-4 max-w-md mx-auto leading-relaxed">
            Discover carefully selected pieces, designed to enhance the modern
            woman with elegance and simplicity.
          </p>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-3 mt-10 font-inter text-xs uppercase tracking-[0.2em] bg-[#1a1a1a] text-white px-8 py-4 hover:bg-[#c9a96e] transition-all duration-400"
          >
            View Collection
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </motion.div>
      </section>
    </PageTransition>
  );
};

export default AboutPage;
