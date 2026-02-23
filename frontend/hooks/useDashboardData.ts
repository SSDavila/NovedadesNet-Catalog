'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
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

interface DetailedSellerSale {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  commissionRate: number;
  commissionAmount: number;
  documentNumber: string;
  date: string;
  type: string;
}

interface SellerCommission {
  userId: number;
  userName: string;
  userEmail: string;
  totalSales: number;
  totalCommission: number;
  salesCount: number;
}

export function useDashboardData(startDate?: string, endDate?: string) {
  const queryClient = useQueryClient();

  // Fetch all dashboard data
  const fetchData = async () => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const queryString = params.toString() ? `?${params.toString()}` : '';

    // Some endpoints may not support dates yet, but we pass them anyway to be ready
    const [statsRes, customersRes, profitRes, salesRes, sellersRes, commissionsRes] = await Promise.all([
      fetch(`${API_BASE_URL}/dashboard/stats${queryString}`),
      fetch(`${API_BASE_URL}/dashboard/monthly-customers?months=6`), // Monthly charts usually fixed range
      fetch(`${API_BASE_URL}/dashboard/monthly-profit?months=6`),    // Monthly charts usually fixed range
      fetch(`${API_BASE_URL}/dashboard/recent-sales?limit=5`),        // Recent sales are usually absolute latest
      fetch(`${API_BASE_URL}/dashboard/bestsellers${queryString}${queryString ? '&' : '?'}limit=5`),
      fetch(`${API_BASE_URL}/dashboard/seller-commissions${queryString}`),
    ]);

    if (!statsRes.ok || !customersRes.ok || !profitRes.ok || !salesRes.ok || !sellersRes.ok || !commissionsRes.ok) {
      throw new Error('Error al cargar los datos del dashboard');
    }

    return {
      stats: await statsRes.json() as DashboardStats,
      monthlyCustomers: await customersRes.json() as MonthlyCustomer[],
      monthlyProfit: await profitRes.json() as MonthlyProfit[],
      recentSales: await salesRes.json() as RecentSale[],
      bestSellers: await sellersRes.json() as BestSeller[],
      sellerCommissions: await commissionsRes.json() as SellerCommission[],
    };
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboardData', startDate, endDate],
    queryFn: fetchData,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const fetchSellerDetails = async (sellerId: number) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      const queryString = params.toString() ? `?${params.toString()}` : '';

      const res = await fetch(`${API_BASE_URL}/dashboard/seller-sales-details/${sellerId}${queryString}`);
      if (!res.ok) throw new Error('Error al cargar detalles del vendedor');
      return await res.json() as DetailedSellerSale[];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return {
    ...data,
    stats: data?.stats || null,
    monthlyCustomers: data?.monthlyCustomers || [],
    monthlyProfit: data?.monthlyProfit || [],
    recentSales: data?.recentSales || [],
    bestSellers: data?.bestSellers || [],
    sellerCommissions: data?.sellerCommissions || [],
    fetchSellerDetails,
    refresh: refetch,
    loading: isLoading,
    error: isError ? (error as Error).message : null,
  };
}
