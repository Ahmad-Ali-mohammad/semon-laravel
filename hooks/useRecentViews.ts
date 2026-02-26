
import { useState, useEffect, useCallback } from 'react';
import { Reptile } from '../types';
import { useDatabase } from '../contexts/DatabaseContext';
import { useAuth } from './useAuth';
import { api } from '../services/api';

export const useRecentViews = () => {
  const { products } = useDatabase();
  const { user } = useAuth();
  const [recentIds, setRecentIds] = useState<number[]>([]);

  useEffect(() => {
    // تخطي التحميل للمشرفين
    if (!user || user.role === 'admin' || user.role === 'manager') {
      setRecentIds([]);
      return;
    }
    api.getRecentViews().then(ids => {
      setRecentIds(ids || []);
    }).catch(() => {
      setRecentIds([]);
    });
  }, [user]);

  const addView = useCallback((id: number) => {
    if (!user || user.role === 'admin' || user.role === 'manager') return;

    setRecentIds(prev => {
      const filtered = prev.filter(viewId => viewId !== id);
      return [id, ...filtered].slice(0, 4);
    });

    api.recordView(id).catch(() => {});
  }, [user]);

  const recentProducts = recentIds
    .map(id => products.find(r => r.id === id))
    .filter((r): r is Reptile => r !== undefined);

  return { recentProducts, addView };
};
