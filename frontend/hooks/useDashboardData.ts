'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/constants';

interface DashboardStats {
  totalRevenue: number;
  totalProfit: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  profitChange: number;
  profitMargin: number;
}

interface MonthlyCustomer {
  month: string;
  count: number;
}

interface MonthlyProfit {
  month: string;
  revenue: number;
  profit: number;
}

interface RecentSale {
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

interface BestSeller {
  productId: string;
  productName: string;
  productPrice: string | number; // Prisma Decimal comes as string from API
  totalSold: number;
  images: Array<{ productImageUrl: string }>;
}

export function useDashboardData(dateRange?: { startDate?: string; endDate?: string }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [monthlyCustomers, setMonthlyCustomers] = useState<MonthlyCustomer[]>([]);
  const [monthlyProfit, setMonthlyProfit] = useState<MonthlyProfit[]>([]);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, customersRes, profitRes, salesRes, sellersRes] = await Promise.all([
          fetch(`${API_BASE_URL}/dashboard/stats`),
          fetch(`${API_BASE_URL}/dashboard/monthly-customers?months=6`),
          fetch(`${API_BASE_URL}/dashboard/monthly-profit?months=6`),
          fetch(`${API_BASE_URL}/dashboard/recent-sales?limit=5`),
          fetch(`${API_BASE_URL}/dashboard/bestsellers?limit=5`),
        ]);

        if (!statsRes.ok || !customersRes.ok || !profitRes.ok || !salesRes.ok || !sellersRes.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }

        const [statsData, customersData, profitData, salesData, sellersData] = await Promise.all([
          statsRes.json(),
          customersRes.json(),
          profitRes.json(),
          salesRes.json(),
          sellersRes.json(),
        ]);

        setStats(statsData);
        setMonthlyCustomers(customersData);
        setMonthlyProfit(profitData);
        setRecentSales(salesData);
        setBestSellers(sellersData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return {
    stats,
    monthlyCustomers,
    monthlyProfit,
    recentSales,
    bestSellers,
    loading,
    error,
  };
}
