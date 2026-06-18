import React, { createContext, useContext, useState } from 'react';
import { Product } from '../data/products';

interface RecentlyViewedContextType {
  items: Product[];
  addRecentlyViewed: (product: Product) => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);

  const addRecentlyViewed = (product: Product) => {
    setItems(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  };

  return (
    <RecentlyViewedContext.Provider value={{ items, addRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  return context;
};
