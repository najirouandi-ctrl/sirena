import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import PageTransition from "../components/PageTransition";

const sections = [
  {
    id: "overview",
    title: "1. Aperçu",
    content: `La présente Politique de confidentialité décrit comment Siréna (« nous », « notre », « nos ») collecte, utilise et protège les informations vous concernant lorsque vous utilisez notre site web et nos services.

En utilisant notre site, vous acceptez la collecte et l’utilisation de vos informations conformément à cette politique.`,
  },
  {
    id: "collection",
    title: "2. Informations que nous collectons",
    content: `Nous pouvons collecter certaines informations lorsque vous utilisez notre site, notamment :

• Informations de navigation
• Informations de contact (email, téléphone si fourni)
• Données liées à vos commandes ou demandes via WhatsApp`,
  },
  {
    id: "use",
    title: "3. Utilisation des informations",
    content: `Nous utilisons vos informations pour :

• Traiter et gérer vos demandes
• Améliorer votre expérience utilisateur
• Communiquer avec vous concernant vos commandes ou nos offres
• Améliorer nos services et notre site web`,
  },
  {
    id: "sharing",
    title: "4. Partage des informations",
    content: `Nous ne vendons pas vos données personnelles.

Vos informations peuvent être partagées uniquement avec des services nécessaires au fonctionnement de notre activité (livraison, communication, support client).`,
  },
  {
    id: "cookies",
    title: "5. Cookies et technologies de suivi",
    content: `Notre site peut utiliser des cookies afin d’améliorer votre expérience, analyser le trafic et optimiser nos services.`,
  },
  {
    id: "security",
    title: "6. Sécurité des données",
    content: `Nous mettons en place des mesures de sécurité appropriées pour protéger vos informations contre tout accès non autorisé, perte ou modification`,
  },
  {
    id: "rights",
    title: "7. Vos droits",
    content: `Conformément à la réglementation applicable, vous pouvez :

• Demander l’accès à vos données
• Demander la modification ou suppression de vos informations
• Vous opposer à certains traitements`,
  },
  {
    id: "retention",
    title: "8. Conservation des données",
    content: `Nous conservons vos données uniquement pendant la durée nécessaire à l’utilisation prévue ou conformément à nos obligations légales.`,
  },
  {
    id: "children",
    title: "9. Protection des enfants",
    content: `Nos services ne sont pas destinés aux enfants de moins de 16 ans. Nous ne collectons pas sciemment leurs données personnelles.`,
  },
  {
    id: "changes",
    title: "10. Modifications de cette politique",
    content: `Nous pouvons mettre à jour cette politique de confidentialité à tout moment. Les modifications seront publiées sur cette page.

Dernière mise à jour : Décembre 2025`,
  },
];

const PrivacyPage: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>("overview");

  return (
    <PageTransition>
      {/* Header */}
      <div className="bg-[#faf8f5] pt-32 pb-16 px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="font-inter text-[10px] uppercase tracking-[0.3em] text-[#c9a96e]"
        >
          Mentions légales
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-playfair text-5xl text-[#1a1a1a] mt-4"
        >
          Politique de confidentialité
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-inter text-sm text-gray-400 mt-4"
        >
          Dernière mise à jour : Décembre 2025
        </motion.p>
      </div>

      <div className="max-w-[800px] mx-auto px-6 py-16">
        {/* Intro */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-inter text-sm text-gray-500 leading-relaxed mb-12 border-l-2 border-[#c9a96e] pl-5"
        >
          Chez Siréna, votre confidentialité est aussi importante pour nous que
          la qualité de nos collections. Nous traitons vos informations
          personnelles avec soin, discrétion et intégrité. Cette politique
          explique comment nous collectons, utilisons et protégeons vos données.
        </motion.p>

        {/* Accordion Sections */}
        <div className="space-y-2">
          {sections.map((section, i) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border border-gray-100"
            >
              <button
                onClick={() =>
                  setOpenSection(openSection === section.id ? null : section.id)
                }
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-[#faf8f5] transition-colors"
              >
                <span className="font-playfair text-base text-[#1a1a1a]">
                  {section.title}
                </span>
                <motion.div
                  animate={{ rotate: openSection === section.id ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                </motion.div>
              </button>
              <AnimatePresence>
                {openSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="font-inter text-sm text-gray-500 leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-[#faf8f5] border border-[#e8dfd0]"
        >
          <h3 className="font-playfair text-xl text-[#1a1a1a]">
            Questions sur votre confidentialité ?
          </h3>
          <p className="font-inter text-sm text-gray-500 mt-3 leading-relaxed">
            Si vous avez des questions concernant cette politique ou la gestion
            de vos données, vous pouvez nous contacter :
          </p>
          <div className="mt-4 space-y-1">
            <p className="font-inter text-sm text-[#1a1a1a]">
              ✉️ errami01@icloud.com
            </p>
            <p className="font-inter text-sm text-gray-400">
              📞 +212 6 49 68 00 33
            </p>
          </div>
        </motion.div>

        {/* Terms Note */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <p className="font-inter text-xs text-gray-400 leading-relaxed">
            En utilisant notre site, vous acceptez notre Politique de
            confidentialité ainsi que nos Conditions Générales d’Utilisation.
            Nous appliquons les normes internationales de protection des
            données, notamment le RGPD.
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default PrivacyPage;
