import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Idea, Purchase } from '../types';
import { useAuth } from './AuthContext';
import { ideaService } from './ideaService';

interface CartContextType {
  items: Idea[];
  addItem: (item: Idea) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  purchases: Purchase[];
  loadingPurchases: boolean;
  refreshPurchases: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const [items, setItems] = useState<Idea[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loadingPurchases, setLoadingPurchases] = useState(false);

  const refreshPurchases = useCallback(async () => {
    if (profile?.uid) {
      setLoadingPurchases(true);
      try {
        const data = await ideaService.getPurchases(false, profile.uid);
        setPurchases(data);
      } catch (err) {
        console.error('Failed to fetch purchases', err);
      } finally {
        setLoadingPurchases(false);
      }
    } else {
      setPurchases([]);
    }
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      await Promise.resolve();
      if (!active) return;
      await refreshPurchases();
    };
    run();
    return () => {
      active = false;
    };
  }, [refreshPurchases]);

  const addItem = (item: Idea) => {
    if (items.some(i => i.id === item.id)) {
      alert('This project is already in your cart.');
      return;
    }
    // Also protect against attempting to add already purchased/pending ideas
    const existing = purchases.find(p => p.ideaId === item.id);
    if (existing) {
      if (existing.status === 'pending') {
        alert('This project is already awaiting verification.');
        return;
      }
      if (existing.status === 'confirmed') {
        alert('You have already acquired this project.');
        return;
      }
    }
    setItems([...items, item]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((acc, i) => acc + i.price, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, purchases, loadingPurchases, refreshPurchases }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

