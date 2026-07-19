import { useEffect, useMemo, useState } from 'react';
import type { Order } from '../types';
import { generateOrders, buildRevenueTrend, buildCategoryTotals, buildStatSummary } from './mockData';
// import { supabase } from '../lib/supabaseClient';

interface DashboardData {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

/**
 * Loads dashboard data. Currently returns generated mock data so the UI
 * runs immediately with no backend setup required.
 *
 * To wire this up to a real Supabase table, replace the body of loadOrders
 * with something like:
 *
 *   const { data, error } = await supabase
 *     .from('orders')
 *     .select('id, customer, product, category, amount, status, date')
 *     .order('date', { ascending: false });
 *   if (error) throw error;
 *   setOrders(data as Order[]);
 */
export function useDashboardData(): DashboardData {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
      try {
        setLoading(true);
        // Simulate network latency so loading states are visible.
        await new Promise((resolve) => setTimeout(resolve, 300));
        if (!cancelled) {
          setOrders(generateOrders());
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load orders');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOrders();
    return () => {
      cancelled = true;
    };
  }, []);

  return { orders, loading, error };
}

export function useDashboardDerivedData(orders: Order[]) {
  const revenueTrend = useMemo(() => buildRevenueTrend(orders), [orders]);
  const categoryTotals = useMemo(() => buildCategoryTotals(orders), [orders]);
  const statSummary = useMemo(() => buildStatSummary(orders), [orders]);
  return { revenueTrend, categoryTotals, statSummary };
}
