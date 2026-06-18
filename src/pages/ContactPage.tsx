import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Mail, Phone, Clock, Send, CheckCircle } from "lucide-react";
import PageTransition from "../components/PageTransition";

// 🔑 Collez ici l'URL de votre déploiement Google Apps Script
const GOOGLE_SHEET_URL =
  "https://script.google.com/macros/s/AKfycbyn9K_Ivh8j6vn34farFmYdptMYhbqtV0X5FPdJ6GLeu50NaWxh3a8EUxGusKJUY3XhHw/exec";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Google Apps Script requiert no-cors car il redirige
      await fetch(GOOGLE_SHEET_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });

      // no-cors ne retourne pas de réponse lisible — si fetch ne throw pas, c'est bon
      setSubmitted(true);
    } catch (err) {
      console.error("Sheets error:", err);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = [
    {
      Icon: Mail,
      title: t("contact.email"),
      value: t("contact.emailAddress"),
      sub: t("contact.emailResponse"),
    },
    {
      Icon: Phone,
      title: t("contact.phone"),
      value: t("contact.phoneNumber"),
      sub: t("contact.phoneHours"),
    },
    {
      Icon: Clock,
      title: t("contact.hours"),
      value: t("contact.hoursWeek"),
      sub: t("contact.hoursSaturday"),
    },
  ];

  return (
    <PageTransition>
      {/* Header */}
      <div className="pt-32 pb-16 bg-[#faf8f5] text-center px-6">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]"
        >
          {t("contact.title")}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-playfair text-5xl md:text-6xl text-[#1a1a1a] mt-4"
        >
          {t("contact.heading")}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-inter text-sm text-gray-400 mt-4 max-w-md mx-auto leading-relaxed"
        >
          {t("contact.subtitle")}
        </motion.p>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <h2 className="font-playfair text-2xl text-[#1a1a1a] mb-8">
                Contact Information
              </h2>
              <div className="space-y-8">
                {contactDetails.map(({ Icon, title, value, sub }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-10 h-10 border border-[#c9a96e]/30 flex items-center justify-center flex-shrink-0">
                      <Icon
                        size={16}
                        className="text-[#c9a96e]"
                        strokeWidth={1.5}
                      />
                    </div>
                    <div>
                      <p className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-400">
                        {title}
                      </p>
                      <p className="font-playfair text-lg text-[#1a1a1a] mt-0.5">
                        {value}
                      </p>
                      <p className="font-inter text-xs text-gray-400 mt-0.5">
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social */}
              <div className="mt-12 pt-8 border-t border-gray-100">
                <p className="font-inter text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-4">
                  {t("Follow Us")}
                </p>
                <div className="flex items-center gap-3">
                  <a
                    href="https://www.instagram.com/sirena.ls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#c9a96e] transition-colors border border-gray-200 hover:border-[#c9a96e] px-3 py-2"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://wa.me/212688031457"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-inter text-[11px] uppercase tracking-widest text-gray-500 hover:text-[#c9a96e] transition-colors border border-gray-200 hover:border-[#c9a96e] px-3 py-2"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="lg:col-span-3"
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-20"
              >
                <CheckCircle
                  size={48}
                  className="text-[#c9a96e]"
                  strokeWidth={1}
                />
                <h3 className="font-playfair text-2xl text-[#1a1a1a] mt-6">
                  Message Sent
                </h3>
                <p className="font-inter text-sm text-gray-400 mt-3 max-w-sm leading-relaxed">
                  Your message has been sent successfully.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", subject: "", message: "" });
                  }}
                  className="mt-8 font-inter text-xs uppercase tracking-[0.15em] text-[#c9a96e] border border-[#c9a96e] px-6 py-3 hover:bg-[#c9a96e] hover:text-white transition-all"
                >
                  Send Another Message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="font-playfair text-2xl text-[#1a1a1a] mb-8">
                  {t("contact.heading")}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 block mb-2">
                      {t("contact.form.name")} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full border border-gray-200 font-inter text-sm text-[#1a1a1a] px-4 py-3.5 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 block mb-2">
                      {t("contact.form.email")} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full border border-gray-200 font-inter text-sm text-[#1a1a1a] px-4 py-3.5 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-gray-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 block mb-2">
                    {t("contact.form.subject")} *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className="w-full border border-gray-200 font-inter text-sm text-[#1a1a1a] px-4 py-3.5 outline-none focus:border-[#c9a96e] transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="font-inter text-[11px] uppercase tracking-[0.15em] text-gray-500 block mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Message"
                    className="w-full border border-gray-200 font-inter text-sm text-[#1a1a1a] px-4 py-3.5 outline-none focus:border-[#c9a96e] transition-colors placeholder:text-gray-300 resize-none"
                  />
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="font-inter text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-3"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-3 w-full sm:w-auto font-inter text-xs uppercase tracking-[0.2em] bg-[#1a1a1a] text-white px-10 py-4 hover:bg-[#c9a96e] transition-all duration-400 disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full block"
                      />
                      {t("contact.form.sending")}
                    </>
                  ) : (
                    <>
                      <Send size={14} strokeWidth={1.5} />
                      {t("contact.form.send")}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
