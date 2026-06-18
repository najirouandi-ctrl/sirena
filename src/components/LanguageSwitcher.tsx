import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC<{ isTransparent?: boolean }> = ({
  isTransparent = false,
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center">
      <span
        className={`font-inter text-xs uppercase tracking-[0.1em] ${
          isTransparent ? "text-white/90" : "text-[#1a1a1a]"
        }`}
        aria-label={t("common.language")}
      >
        EN
      </span>
    </div>
  );
};

export default LanguageSwitcher;
