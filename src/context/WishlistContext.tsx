import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../data/products';

interface WishlistContextType {
  items: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(items));
  }, [items]);

  const addToWishlist = (product: Product) => {
    setItems(prev => prev.find(p => p.id === product.id) ? prev : [...prev, product]);
  };

  const removeFromWishlist = (productId: string) => {
    setItems(prev => prev.filter(p => p.id !== productId));
  };

  const isWishlisted = (productId: string) => {
    return items.some(p => p.id === productId);
  };

  const toggleWishlist = (product: Product) => {
    if (isWishlisted(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider value={{
      items, addToWishlist, removeFromWishlist, isWishlisted, toggleWishlist, totalItems,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
};
