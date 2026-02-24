'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { useState, useEffect } from 'react';
import { IconType } from 'react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { FaDollarSign, FaUsers, FaBox, FaChartLine, FaArrowTrendUp, FaArrowTrendDown, FaStar, FaReceipt, FaCalendarDays } from 'react-icons/fa6';
import { formatDistanceToNow, format, parse, startOfMonth, endOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string;
  change: number;
  color: string;
  subtitle?: string;
}

const StatCard = ({ icon: Icon, title, value, change, color, subtitle }: StatCardProps) => {
  const isPositive = change >= 0;

  return (
    <div className="relative group overflow-hidden bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] hover:shadow-[0_8px_32px_0_rgba(124,58,237,0.15)] transition-all duration-500 hover:-translate-y-1">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent blur-2xl rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />

      <div className="flex items-center justify-between relative z-10">
        <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg shadow-purple-500/20`}>
          <Icon className="text-white h-5 w-5" />
        </div>
        <div className="flex flex-col items-end">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase ${isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
            }`}>
            {isPositive ? <FaArrowTrendUp className="h-3 w-3" /> : <FaArrowTrendDown className="h-3 w-3" />}
            <span>{isPositive ? '+' : ''}{change.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-6 relative z-10">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{title}</p>
        <div className="flex items-baseline gap-2 mt-1">
          <p className="text-3xl font-black text-gray-900 tracking-tighter">{value}</p>
        </div>
        {subtitle && (
          <p className="text-[11px] font-bold text-gray-500 mt-2 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

const MonthlyProfitChart = ({ data }: { data: Array<{ month: string; revenue: number; profit: number }> }) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.profit)));

  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <FaChartLine className="w-24 h-24 text-purple-600" />
      </div>

      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-10 relative z-10">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <FaChartLine className="text-purple-600 w-4 h-4" />
        </div>
        Ingresos vs Ganancias
      </h3>

      <div className="h-64 flex items-end gap-4 relative z-10">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-4 group/bar">
            <div className="w-full flex gap-1.5 items-end h-full">
              <div
                className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-2xl hover:brightness-110 transition-all duration-500 relative cursor-help shadow-lg shadow-indigo-500/10"
                style={{ height: `${(item.revenue / maxValue) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-black rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                  ${item.revenue.toFixed(0)}
                </div>
              </div>
              <div
                className="flex-1 bg-gradient-to-t from-purple-500 to-purple-300 rounded-2xl hover:brightness-110 transition-all duration-500 relative cursor-help shadow-lg shadow-purple-500/10"
                style={{ height: `${(item.profit / maxValue) * 100}%` }}
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-black rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                  ${item.profit.toFixed(0)}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MonthlyCustomersChart = ({ data }: { data: Array<{ month: string; count: number }> }) => {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <FaUsers className="w-24 h-24 text-sky-600" />
      </div>

      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-10 relative z-10">
        <div className="p-2 bg-sky-500/10 rounded-lg">
          <FaUsers className="text-sky-600 w-4 h-4" />
        </div>
        Clientes Nuevos
      </h3>

      <div className="h-64 flex items-end gap-5 relative z-10">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-4 group/bar">
            <div
              className="w-full bg-gradient-to-t from-sky-500 to-sky-300 rounded-2xl hover:brightness-110 transition-all duration-500 relative cursor-help shadow-lg shadow-sky-500/10"
              style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-[10px] font-black rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                {item.count} clientes
              </div>
            </div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopProductsWidget = ({ products }: { products: Array<{ productName: string; totalSold: number; productPrice: string | number; images: Array<{ productImageUrl: string }> }> }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-500/10 rounded-lg">
          <FaStar className="text-amber-500 w-4 h-4" />
        </div>
        Top Ventas
      </h3>
      <ul className="space-y-4">
        {products.map((product, index) => (
          <li key={index} className="flex items-center gap-5 p-4 rounded-[1.5rem] hover:bg-white/40 transition-all duration-300 group cursor-default">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-500">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].productImageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaBox />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">{product.productName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 text-[10px] font-black rounded-full lowercase">
                  {product.totalSold} vendidos
                </span>
              </div>
            </div>
            <p className="text-lg font-black text-gray-900 tracking-tighter">${Number(product.productPrice).toFixed(0)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecentSalesWidget = ({ sales }: { sales: Array<{ invoiceNumber: string; customerName: string; total: number; createdAt: string; status: string }> }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
        <div className="p-2 bg-purple-500/10 rounded-lg">
          <FaReceipt className="text-purple-600 w-4 h-4" />
        </div>
        Últimas Ventas
      </h3>
      <ul className="space-y-4">
        {sales.map((sale, index) => (
          <li key={index} className="flex items-start gap-4 p-4 rounded-[1.5rem] hover:bg-white/40 transition-all duration-300 group cursor-default">
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full p-3 flex-shrink-0 shadow-lg shadow-purple-500/20 group-hover:rotate-12 transition-transform duration-500">
              <FaReceipt className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900">#{sale.invoiceNumber}</p>
              <p className="text-xs font-bold text-gray-500 truncate">{sale.customerName}</p>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mt-1">
                {formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true, locale: es })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-lg font-black text-gray-900 tracking-tighter">${sale.total.toFixed(0)}</p>
              <span className={`text-[9px] px-2 py-0.5 font-black uppercase tracking-widest rounded-full ${sale.status === 'AUTORIZADO' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-gray-200/50 text-gray-500'
                }`}>
                {sale.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SellerCommissionsWidget = ({ commissions }: { commissions: Array<{ userName: string; userEmail: string; totalSales: number; totalCommission: number; salesCount: number }> }) => {
  return (
    <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl overflow-hidden">
      <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-3 mb-8">
        <div className="p-2 bg-emerald-500/10 rounded-lg">
          <FaUsers className="text-emerald-600 w-4 h-4" />
        </div>
        Ranking Vendedores
      </h3>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
              <th className="pb-4 px-2">Vendedor</th>
              <th className="pb-4 text-right px-2">Ventas Brutas</th>
              <th className="pb-4 text-right px-2">Comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {commissions.length > 0 ? (
              commissions.map((seller, index) => (
                <tr key={index} className="group hover:bg-white/40 transition-all duration-300">
                  <td className="py-5 px-2">
                    <p className="text-sm font-black text-gray-900">{seller.userName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{seller.salesCount} tickets</p>
                  </td>
                  <td className="py-5 text-right px-2">
                    <p className="text-sm font-bold text-gray-700">${seller.totalSales.toFixed(0)}</p>
                  </td>
                  <td className="py-5 text-right px-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                      <span className="text-xs font-black text-emerald-600">${seller.totalCommission.toFixed(2)}</span>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                  No activity recorded this period
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const SellerHistoryTab = ({ sellerCommissions, fetchSellerDetails }: {
  sellerCommissions: any[],
  fetchSellerDetails: (id: number) => Promise<any[]>
}) => {
  const [selectedSeller, setSelectedSeller] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    if (selectedSeller) {
      setLoadingDetails(true);
      fetchSellerDetails(selectedSeller).then(data => {
        setHistory(data);
        setLoadingDetails(false);
      });
    } else {
      setHistory([]);
    }
  }, [selectedSeller, fetchSellerDetails]);

  const totalCommissionToPay = history.reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return (
    <div className="space-y-10">
      <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tighter">Detalle por Vendedor</h3>
          <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-widest">Sellers Audit & History</p>
        </div>
        <select
          className="bg-gray-50 border border-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest rounded-2xl focus:ring-purple-500 focus:border-purple-500 block w-full md:w-80 p-4 outline-none transition-all shadow-sm"
          value={selectedSeller || ''}
          onChange={(e) => setSelectedSeller(Number(e.target.value) || null)}
        >
          <option value="">Seleccionar Vendedor</option>
          {sellerCommissions.map((s: any) => (
            <option key={s.userId} value={s.userId}>
              {s.userName}
            </option>
          ))}
        </select>
      </div>

      {selectedSeller ? (
        <div className="grid grid-cols-1 gap-10">
          <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-xl overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-6">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Historial de Operaciones</h4>
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-8 py-5 rounded-[1.5rem] shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/20 blur-3xl rounded-full -mr-10 -mt-10" />
                <p className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em] relative z-10">Total a Liquidar</p>
                <p className="text-3xl font-black text-white tracking-tighter mt-1 relative z-10">${totalCommissionToPay.toFixed(2)}</p>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              {loadingDetails ? (
                <div className="flex justify-center py-24">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : history.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                      <th className="pb-5 px-4">Fecha / Documento</th>
                      <th className="pb-5 px-4">Producto</th>
                      <th className="pb-5 text-right px-4">Cant.</th>
                      <th className="pb-5 text-right px-4">Subtotal</th>
                      <th className="pb-5 text-right px-4">Tasa (%)</th>
                      <th className="pb-5 text-right px-4">Ganancia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {history.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-white/40 transition-all duration-300">
                        <td className="py-6 px-4">
                          <p className="text-sm font-black text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.type} #{item.documentNumber}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-sm font-black text-gray-900">{item.productName}</p>
                          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-1">ID: {item.productId}</p>
                        </td>
                        <td className="py-6 text-right px-4 text-sm font-black text-gray-600">{item.quantity}</td>
                        <td className="py-6 text-right px-4 text-sm font-black text-gray-900">${item.subtotal.toFixed(2)}</td>
                        <td className="py-6 text-right px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.commissionRate}%</td>
                        <td className="py-6 text-right px-4">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full">
                            <span className="text-sm font-black text-emerald-600 font-mono">${item.commissionAmount.toFixed(2)}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">No records found for this period</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl p-24 rounded-[3rem] border border-white/20 shadow-xl flex flex-col items-center justify-center text-center group">
          <div className="p-8 bg-purple-500/10 rounded-[2rem] mb-8 group-hover:scale-110 transition-transform duration-500">
            <FaUsers className="h-16 w-16 text-purple-600" />
          </div>
          <h4 className="text-2xl font-black text-gray-900 tracking-tighter">Selecciona un Vendedor</h4>
          <p className="text-sm font-bold text-gray-500 mt-4 max-w-xs mx-auto uppercase tracking-widest leading-relaxed">
            Choose a team member to view their detailed performance and aggregated statistics.
          </p>
        </div>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'resumen' | 'vendedores'>('resumen');
  const [selectedMonth, setSelectedMonth] = useState(() => format(new Date(), 'yyyy-MM'));

  // Calculate start and end of selected month
  const currentMonthDate = parse(selectedMonth, 'yyyy-MM', new Date());
  const startDate = startOfMonth(currentMonthDate).toISOString();
  const endDate = endOfMonth(currentMonthDate).toISOString();

  const {
    stats,
    monthlyCustomers,
    monthlyProfit,
    recentSales,
    bestSellers,
    sellerCommissions,
    fetchSellerDetails,
    loading,
    error
  } = useDashboardData(startDate, endDate);

  if (loading) {
    return (
      <div className="p-4 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-gray-50 min-h-full flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-800 font-semibold">Error al cargar el dashboard</p>
          <p className="text-red-600 text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-10 bg-[#f8f9ff] min-h-screen">
      <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter">
            Dashboard <span className="text-purple-600">Premium</span>
          </h1>
          <p className="text-sm font-bold text-gray-500 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            Control Center & Analytics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/60 backdrop-blur-xl p-2 rounded-[2rem] border border-white/40 shadow-xl">
          <div className="flex gap-1 relative w-full sm:w-auto p-1">
            {['resumen', 'vendedores'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-500 relative z-10 ${activeTab === tab ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                  }`}
              >
                <span className="relative z-20">
                  {tab === 'resumen' ? 'Analytics' : 'Sellers'}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-700 shadow-lg shadow-purple-600/30 rounded-2xl"
                    transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-10 bg-gray-200" />

          <div className="flex items-center bg-gray-900/5 px-6 py-3 rounded-2xl border border-transparent hover:border-purple-200 hover:bg-white transition-all group w-full sm:w-auto cursor-pointer">
            <FaCalendarDays className="text-purple-500 transition-colors mr-3 h-4 w-4" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none text-xs font-black text-gray-900 uppercase tracking-widest cursor-pointer w-full sm:w-auto"
            />
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeTab === 'resumen' ? (
          <motion.div
            key="resumen"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                title="Ingresos del Mes"
                value={`$${stats?.totalRevenue.toFixed(2) || '0.00'}`}
                change={stats?.revenueChange || 0}
                icon={FaDollarSign}
                color="from-emerald-500 to-teal-600"
                subtitle="vs mes anterior"
              />
              <StatCard
                title="Ganancias del Mes"
                value={`$${stats?.totalProfit.toFixed(2) || '0.00'}`}
                change={stats?.profitChange || 0}
                icon={FaChartLine}
                color="from-purple-500 to-indigo-600"
                subtitle={`Margen: ${stats?.profitMargin || 0}%`}
              />
              <StatCard
                title="Total Clientes"
                value={stats?.totalCustomers.toString() || '0'}
                change={0}
                icon={FaUsers}
                color="from-sky-500 to-blue-600"
                subtitle="Registrados"
              />
              <StatCard
                title="Productos Activos"
                value={stats?.totalProducts.toString() || '0'}
                change={0}
                icon={FaBox}
                color="from-orange-500 to-amber-600"
                subtitle="En catálogo"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MonthlyProfitChart data={monthlyProfit} />
              <MonthlyCustomersChart data={monthlyCustomers} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <TopProductsWidget products={bestSellers} />
              <RecentSalesWidget sales={recentSales} />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <SellerCommissionsWidget
                commissions={sellerCommissions.filter(s => s.totalSales > 0)}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="vendedores"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <SellerHistoryTab
              sellerCommissions={sellerCommissions}
              fetchSellerDetails={fetchSellerDetails}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
