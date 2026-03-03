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
    <div className="bg-white p-7 rounded-2xl border border-gray-100 shadow-soft transition-all duration-300 hover:shadow-deep group">
      <div className="flex items-center justify-between">
        <div className={`p-2.5 rounded-xl bg-purple-50 text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
          {isPositive ? <FaArrowTrendUp className="h-2.5 w-2.5" /> : <FaArrowTrendDown className="h-2.5 w-2.5" />}
          {isPositive ? '+' : ''}{change.toFixed(1)}%
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>
        {subtitle && (
          <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1.5 font-medium">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
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
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <FaChartLine className="text-purple-600" />
          Analytics Financiero
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Ingresos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-[10px] font-bold text-gray-500 uppercase">Ganancias</span>
          </div>
        </div>
      </div>

      <div className="h-64 flex items-end gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-4 group/bar">
            <div className="w-full flex gap-1 items-end h-full">
              <div
                className="flex-1 bg-indigo-100 rounded-t-lg hover:bg-indigo-500 transition-colors relative cursor-help"
                style={{ height: `${(item.revenue / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                  ${item.revenue.toFixed(0)}
                </div>
              </div>
              <div
                className="flex-1 bg-purple-100 rounded-t-lg hover:bg-purple-500 transition-colors relative cursor-help"
                style={{ height: `${(item.profit / maxValue) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                  ${item.profit.toFixed(0)}
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{item.month}</span>
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
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-10">
        <FaUsers className="text-purple-600" />
        Adquisición de Clientes
      </h3>

      <div className="h-64 flex items-end gap-5">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-4 group/bar">
            <div
              className="w-full bg-purple-100 rounded-t-lg hover:bg-purple-500 transition-colors relative cursor-help"
              style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[9px] font-bold rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-20">
                {item.count} clientes
              </div>
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopProductsWidget = ({ products }: { products: Array<{ productName: string; totalSold: number; productPrice: string | number; images: Array<{ productImageUrl: string }> }> }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
        <FaStar className="text-amber-500" />
        Rendimiento de Productos
      </h3>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <li key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].productImageUrl}
                  alt={product.productName}
                  className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FaBox className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{product.productName}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {product.totalSold} vendidos
                </span>
              </div>
            </div>
            <p className="text-sm font-bold text-gray-900 tracking-tight">${Number(product.productPrice).toFixed(0)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecentSalesWidget = ({ sales }: { sales: Array<{ invoiceNumber: string; customerName: string; total: number; createdAt: string; status: string }> }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
        <FaReceipt className="text-purple-600" />
        Ventas Recientes
      </h3>
      <ul className="space-y-3">
        {sales.map((sale, index) => (
          <li key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
            <div className="bg-gray-100 rounded-lg p-2.5 flex-shrink-0 group-hover:bg-purple-100 group-hover:text-purple-600 transition-colors">
              <FaReceipt className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">#{sale.invoiceNumber}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider truncate mt-0.5">{sale.customerName}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900 tracking-tight">${sale.total.toFixed(0)}</p>
              <p className="text-[9px] font-bold text-gray-400 mt-0.5">
                {formatDistanceToNow(new Date(sale.createdAt), { addSuffix: false, locale: es })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const SellerCommissionsWidget = ({ commissions }: { commissions: Array<{ userName: string; userEmail: string; totalSales: number; totalCommission: number; salesCount: number }> }) => {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-8">
        <FaUsers className="text-purple-600" />
        Performance del Equipo
      </h3>
      <div className="overflow-x-auto scrollbar-none">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
              <th className="pb-4">Vendedor</th>
              <th className="pb-4 text-right">Ventas</th>
              <th className="pb-4 text-right">Comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {commissions.length > 0 ? (
              commissions.map((seller, index) => (
                <tr key={index} className="group hover:bg-purple-50 transition-colors">
                  <td className="py-4">
                    <p className="text-sm font-bold text-gray-900">{seller.userName}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-0.5">{seller.salesCount} tickets</p>
                  </td>
                  <td className="py-4 text-right">
                    <p className="text-sm font-medium text-gray-600">${seller.totalSales.toFixed(0)}</p>
                  </td>
                  <td className="py-4 text-right font-bold text-purple-600">
                    ${seller.totalCommission.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-12 text-center text-xs text-gray-400 lowercase italic">
                  sin actividad registrada en este periodo
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
    <div className="space-y-12">
      <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 tracking-tight">Reporte Detallado</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Sellers Audit & History</p>
        </div>
        <select
          className="bg-gray-50 border border-gray-100 text-gray-700 text-[11px] font-bold uppercase tracking-widest rounded-xl focus:ring-purple-500 focus:border-purple-500 block w-full md:w-80 p-4 outline-none transition-all shadow-sm"
          value={selectedSeller || ''}
          onChange={(e) => setSelectedSeller(Number(e.target.value) || null)}
        >
          <option value="">Seleccionar Miembro Equipo</option>
          {sellerCommissions.map((s: any) => (
            <option key={s.userId} value={s.userId}>
              {s.userName}
            </option>
          ))}
        </select>
      </div>

      {selectedSeller ? (
        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white p-10 rounded-2xl border border-gray-100 shadow-soft overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-8">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Historial Operativo</h4>
              <div className="bg-gray-900 px-10 py-6 rounded-2xl shadow-deep">
                <p className="text-[9px] font-bold text-purple-400 uppercase tracking-widest">A Liquidar</p>
                <p className="text-3xl font-bold text-white tracking-tight mt-1">${totalCommissionToPay.toFixed(2)}</p>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              {loadingDetails ? (
                <div className="flex justify-center py-24">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                </div>
              ) : history.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50">
                      <th className="pb-6 px-4">Referencia</th>
                      <th className="pb-6 px-4">Producto</th>
                      <th className="pb-6 text-right px-4">Qty</th>
                      <th className="pb-6 text-right px-4">Subtotal</th>
                      <th className="pb-6 text-right px-4">Tasa</th>
                      <th className="pb-6 text-right px-4">Comisión</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/50">
                    {history.map((item, idx) => (
                      <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-6 px-4">
                          <p className="text-sm font-bold text-gray-900">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase mt-0.5">{item.type} #{item.documentNumber}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                          <p className="text-[9px] font-bold text-purple-500 uppercase mt-0.5">ID: {item.productId}</p>
                        </td>
                        <td className="py-6 text-right px-4 text-sm font-medium text-gray-500">{item.quantity}</td>
                        <td className="py-6 text-right px-4 text-sm font-bold text-gray-900">${item.subtotal.toFixed(0)}</td>
                        <td className="py-6 text-right px-4 text-[10px] font-bold text-gray-400 uppercase">{item.commissionRate}%</td>
                        <td className="py-6 text-right px-4">
                          <span className="text-sm font-bold text-purple-600 font-mono">${item.commissionAmount.toFixed(2)}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-24 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">sin registros disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-32 rounded-[2.5rem] border border-gray-100 shadow-soft flex flex-col items-center justify-center text-center group">
          <div className="p-8 bg-gray-50 rounded-2xl mb-10 group-hover:bg-purple-50 group-hover:scale-105 transition-all duration-500">
            <FaUsers className="h-14 w-14 text-gray-300 group-hover:text-purple-600 transition-colors" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 tracking-tight">Auditoría Individual</h4>
          <p className="text-xs font-medium text-gray-400 mt-4 max-w-xs mx-auto uppercase tracking-widest leading-loose">
            Selecciona un miembro del equipo para desplegar sus métricas consolidadas.
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
    <div className="p-4 sm:p-12 bg-[#fcfcfd] min-h-screen">
      <header className="mb-14 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard Analytics
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              Live Overview & Reporting
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="flex bg-gray-100 p-1 rounded-xl">
            {['resumen', 'vendedores'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-8 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${activeTab === tab ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
              >
                {tab === 'resumen' ? 'Overview' : 'Team'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-100 rounded-xl shadow-soft hover:border-purple-200 transition-all group">
            <FaCalendarDays className="text-gray-400 group-hover:text-purple-600 h-3.5 w-3.5" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none text-[10px] font-bold text-gray-600 uppercase tracking-wider cursor-pointer"
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
