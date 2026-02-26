
import React, { createContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { CartItem, Reptile } from '../types';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { resolveMediaUrl } from './DatabaseContext';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Reptile, quantity?: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const normalizeProduct = (p: any): Reptile => ({
  ...p,
  price: Number(p.price || 0),
  imageUrl: resolveMediaUrl(p.imageUrl ?? p.image_url),
  isAvailable: p.isAvailable ?? p.is_available ?? true,
  careInstructions: p.careInstructions ?? p.care_instructions,
  specifications: p.specifications ?? [],
  reviews: p.reviews ?? [],
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthReady, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartItemIdMap, setCartItemIdMap] = useState<Record<number, number>>({});

  const loadCart = useCallback(async () => {
    // تخطي تحميل السلة للمشرفين والمديرين لجعل الحساب مخصص للإدارة فقط
    if (!user || user.role === 'admin' || user.role === 'manager') {
      setCart([]);
      setCartItemIdMap({});
      return;
    }
    try {
      const items = await api.getCart();
      const idMap: Record<number, number> = {};
      const mapped: CartItem[] = (items || []).map((item: any) => {
        const product = normalizeProduct(item.product);
        idMap[product.id] = item.id;
        return {
          ...product,
          quantity: Number(item.quantity || 1),
        };
      });
      setCartItemIdMap(idMap);
      setCart(mapped);
    } catch {
      setCart([]);
      setCartItemIdMap({});
    }
  }, [user]);

  useEffect(() => {
    if (!isAuthReady) return;
    if (!isAuthenticated) {
      setCart([]);
      setCartItemIdMap({});
      return;
    }
    loadCart();
  }, [isAuthReady, isAuthenticated, loadCart]);

  const addToCart = useCallback((item: Reptile, quantity: number = 1) => {
    if (!user) {
        alert('يرجى تسجيل الدخول أولاً لإضافة المنتجات إلى السلة');
        return;
    }

    setCart(prevCart => {
      const existing = prevCart.find(c => c.id === item.id);
      if (existing) {
        return prevCart.map(c =>
          c.id === item.id ? { ...c, quantity: c.quantity + quantity } : c
        );
      }
      return [...prevCart, { ...item, quantity }];
    });

    api.addToCart(item.id, quantity).then((res: any) => {
      if (res?.id) {
        setCartItemIdMap(prev => ({ ...prev, [item.id]: res.id }));
      }
    }).catch(() => {
      loadCart();
    });
  }, [user, loadCart]);

  const removeFromCart = useCallback((id: number) => {
    if (!user) return;

    setCart(prevCart => prevCart.filter(item => item.id !== id));

    const dbId = cartItemIdMap[id];
    if (dbId) {
      api.removeCartItem(dbId).catch(() => {
        loadCart();
      });
      setCartItemIdMap(prev => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });
    }
  }, [user, cartItemIdMap, loadCart]);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => (item.id === id ? { ...item, quantity } : item))
    );

    const dbId = cartItemIdMap[id];
    if (dbId) {
      api.updateCartItem(dbId, quantity).catch(() => {
        loadCart();
      });
    }
  }, [user, cartItemIdMap, removeFromCart, loadCart]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartItemIdMap({});
    if (user) {
      api.clearCart().catch(() => {
        // Silently handle clear cart error
      });
    }
  }, [user]);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  const value = useMemo(() => ({ 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal 
  }), [cart, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
