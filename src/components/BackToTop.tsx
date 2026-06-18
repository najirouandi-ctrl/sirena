import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 500);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-8 w-12 h-12 bg-[#1a1a1a] text-white flex items-center justify-center z-50 hover:bg-[#c9a96e] transition-colors duration-300 shadow-lg"
          aria-label="Back to top"
        >
          <ChevronUp size={18} strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
