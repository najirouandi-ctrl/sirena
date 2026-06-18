import React from "react";
import { createWhatsAppLink } from "../utils/whatsapp";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloatingButton: React.FC = () => {
  const message = "Bonjour, je souhaite commander via WhatsApp.\n\nMerci.";
  const url = createWhatsAppLink(message);

  return (
    <div className="fixed right-5 bottom-4 z-50 flex flex-col items-end gap-3 md:items-end">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="hidden md:flex items-center gap-3 rounded-full bg-[#25d366] px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:bg-[#20b857]"
        aria-label="Commander via WhatsApp"
      >
        <FaWhatsapp size={30} />
      
      </a>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="flex w-full max-w-xs items-center justify-center gap-3 rounded-full bg-[#25d366] px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-300 hover:bg-[#20b857] md:hidden"
        aria-label="Commander via WhatsApp"
      >
        <FaWhatsapp size={30} />
      </a>
    </div>
  );
};

export default WhatsAppFloatingButton;
