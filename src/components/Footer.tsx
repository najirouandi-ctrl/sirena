import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#1a1a1a] text-white">
      {/* Newsletter Banner */}
      <div className="border-b border-white/10 py-16 px-6">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-playfair text-2xl text-white mb-2">
              {t("footer.newsletter")}
            </h3>
            <p className="font-inter text-sm text-white/50 tracking-wide">
              {t("footer.newsletterSubtitle")}
            </p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="flex-1 md:w-72 bg-white/5 border border-white/20 text-white placeholder:text-white/30 font-inter text-sm px-5 py-3 outline-none focus:border-[#c9a96e] transition-colors"
            />
            <button className="bg-[#c9a96e] text-white font-inter text-xs uppercase tracking-[0.15em] px-6 py-3 hover:bg-[#b8956a] transition-colors whitespace-nowrap">
              {t("footer.subscribe")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-playfair text-xl tracking-[0.15em] text-white"
            >
              {t("common.brand")}
            </Link>
            <p className="font-inter text-sm text-white/40 mt-4 leading-relaxed max-w-xs">
              {t("footer.brandDescription")}
            </p>
            <div className="flex items-center gap-4 mt-8">
              <a
                href="https://www.instagram.com/sirena.ls"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-all duration-300"
              >
                <FaInstagram size={16} />
              </a>

              <a
                href="https://wa.me/212688031457"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-white/20 flex items-center justify-center text-white/50 hover:text-[#c9a96e] hover:border-[#c9a96e] transition-all duration-300"
              >
                <FaWhatsapp size={16} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              {t("footer.shop")}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.shopNewArrivals"), path: "/shop" },
                { label: t("footer.shopDresses"), path: "/shop" },
                { label: t("footer.shopMidi"), path: "/shop" },
                { label: t("footer.shopMaxi"), path: "/shop" },
                { label: t("footer.shopMini"), path: "/shop" },
                { label: t("footer.shopSale"), path: "/shop" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="font-inter text-sm text-white/60 hover:text-[#c9a96e] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              {t("footer.about")}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.aboutOurStory"), path: "/about" },
                { label: t("footer.aboutSustainability"), path: "/about" },
                { label: t("footer.aboutCareers"), path: "/about" },
                { label: t("footer.aboutPress"), path: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="font-inter text-sm text-white/60 hover:text-[#c9a96e] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-inter text-[11px] uppercase tracking-[0.2em] text-white/40 mb-6">
              {t("footer.customer")}
            </h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.customerContact"), path: "/contact" },
                { label: t("footer.customerSizeGuide"), path: "/contact" },
                { label: t("footer.customerShipping"), path: "/contact" },
                { label: t("footer.customerPrivacy"), path: "/privacy" },
                { label: t("footer.customerTerms"), path: "/privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="font-inter text-sm text-white/60 hover:text-[#c9a96e] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-inter text-xs text-white/30">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/privacy"
              className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <Link
              to="/privacy"
              className="font-inter text-xs text-white/30 hover:text-white/60 transition-colors"
            >
              {t("footer.terms")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-inter text-[9px] text-white/30 tracking-widest">
              Orders exclusively via WhatsApp
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
