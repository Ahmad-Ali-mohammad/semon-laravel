
import React, { createContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

type WishlistContextType = {
  wishlist: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
};

export const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    // حساب المدير مخصص للإدارة ولا يدعم المفضلة أو السلة الشخصية
    if (!user || user.role === 'admin' || user.role === 'manager') {
      setWishlist([]);
      return;
    }
    api.getWishlist().then(ids => {
      setWishlist(ids || []);
    }).catch(() => {
      setWishlist([]);
    });
  }, [user]);

  const addToWishlist = useCallback(async (id: number) => {
    if (!user) return;

    setWishlist(prev => [...new Set([...prev, id])]);

    try {
      const res = await api.toggleWishlist(id);
      if (res.action === 'removed') {
        setWishlist(prev => prev.filter(itemId => itemId !== id));
      }
    } catch (err) {
      console.error('Wishlist error:', err);
      setWishlist(prev => prev.filter(itemId => itemId !== id));
    }
  }, [user]);

  const removeFromWishlist = useCallback(async (id: number) => {
    if (!user) return;

    setWishlist(prev => prev.filter(itemId => itemId !== id));

    try {
      await api.removeWishlistItem(id);
    } catch (err) {
      console.error('Wishlist error:', err);
      setWishlist(prev => [...new Set([...prev, id])]);
    }
  }, [user]);

  const value = useMemo(() => ({ 
    wishlist, 
    addToWishlist, 
    removeFromWishlist 
  }), [wishlist, addToWishlist, removeFromWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
