import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const NotFoundPage: React.FC = () => {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="font-playfair text-[120px] md:text-[180px] text-[#f0ebe3] leading-none font-normal select-none"
        >
          404
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="-mt-8"
        >
          <h1 className="font-playfair text-3xl md:text-4xl text-[#1a1a1a]">Page Not Found</h1>
          <p className="font-inter text-sm text-gray-400 mt-4 max-w-sm mx-auto leading-relaxed">
            The page you're looking for seems to have slipped away like silk through fingers. 
            Let us guide you back.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link
              to="/"
              className="group flex items-center gap-2 font-inter text-xs uppercase tracking-[0.2em] bg-[#1a1a1a] text-white px-8 py-4 hover:bg-[#c9a96e] transition-all duration-400"
            >
              Return Home
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop"
              className="font-inter text-xs uppercase tracking-[0.2em] border border-gray-200 text-gray-600 px-8 py-4 hover:border-[#c9a96e] hover:text-[#c9a96e] transition-all"
            >
              Shop the Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
