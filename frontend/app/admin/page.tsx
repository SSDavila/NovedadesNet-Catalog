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
    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="text-white h-6 w-6" />
        </div>
        <div className="flex items-center text-sm">
          {isPositive ? (
            <FaArrowTrendUp className="text-green-500 h-4 w-4 mr-1" />
          ) : (
            <FaArrowTrendDown className="text-red-500 h-4 w-4 mr-1" />
          )}
          <span className={isPositive ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </span>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

const MonthlyProfitChart = ({ data }: { data: Array<{ month: string; revenue: number; profit: number }> }) => {
  if (data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => Math.max(d.revenue, d.profit)));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <FaChartLine className="text-indigo-500" />
        Ingresos vs Ganancias (Últimos 6 Meses)
      </h3>
      <div className="h-64 flex items-end gap-3">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end h-full">
              <div
                className="flex-1 bg-blue-200 rounded-t-lg hover:bg-blue-400 transition-all duration-300 relative group"
                style={{ height: `${(item.revenue / maxValue) * 100}%` }}
                title={`Ingresos: $${item.revenue.toFixed(2)}`}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${item.revenue.toFixed(0)}
                </span>
              </div>
              <div
                className="flex-1 bg-green-200 rounded-t-lg hover:bg-green-400 transition-all duration-300 relative group"
                style={{ height: `${(item.profit / maxValue) * 100}%` }}
                title={`Ganancia: $${item.profit.toFixed(2)}`}
              >
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-green-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  ${item.profit.toFixed(0)}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-500">{item.month}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-400 rounded"></div>
          <span className="text-sm text-gray-600">Ingresos</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="text-sm text-gray-600">Ganancias</span>
        </div>
      </div>
    </div>
  );
};

const MonthlyCustomersChart = ({ data }: { data: Array<{ month: string; count: number }> }) => {
  if (data.length === 0) return null;

  const maxCount = Math.max(...data.map(d => d.count));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
        <FaUsers className="text-sky-500" />
        Clientes Nuevos por Mes
      </h3>
      <div className="h-64 flex items-end gap-4">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-sky-200 rounded-t-lg hover:bg-sky-400 transition-all duration-300 relative group"
              style={{ height: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%` }}
              title={`${item.count} clientes`}
            >
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </span>
            </div>
            <span className="text-xs font-medium text-gray-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TopProductsWidget = ({ products }: { products: Array<{ productName: string; totalSold: number; productPrice: string | number; images: Array<{ productImageUrl: string }> }> }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FaStar className="text-amber-500" />
        Top 5 Productos Más Vendidos
      </h3>
      <ul className="space-y-3">
        {products.map((product, index) => (
          <li key={index} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
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
              <p className="text-sm font-semibold text-gray-800 truncate">{product.productName}</p>
              <p className="text-xs text-gray-500">{product.totalSold} vendidos</p>
            </div>
            <p className="text-sm font-bold text-gray-900">${Number(product.productPrice).toFixed(2)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const RecentSalesWidget = ({ sales }: { sales: Array<{ invoiceNumber: string; customerName: string; total: number; createdAt: string; status: string }> }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FaReceipt className="text-purple-500" />
        Ventas Recientes
      </h3>
      <ul className="space-y-3">
        {sales.map((sale, index) => (
          <li key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="bg-purple-100 rounded-full p-2 flex-shrink-0">
              <FaReceipt className="h-4 w-4 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">Factura #{sale.invoiceNumber}</p>
              <p className="text-xs text-gray-500 truncate">{sale.customerName}</p>
              <p className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(sale.createdAt), { addSuffix: true, locale: es })}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm font-bold text-gray-900">${sale.total.toFixed(2)}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${sale.status === 'AUTORIZADO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
        <FaUsers className="text-green-500" />
        Resumen de Vendedores y Comisiones
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-50">
              <th className="pb-3 font-medium">Vendedor</th>
              <th className="pb-3 font-medium text-right">Ventas</th>
              <th className="pb-3 font-medium text-right">Comisión</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {commissions.length > 0 ? (
              commissions.map((seller, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <p className="font-semibold text-gray-800">{seller.userName}</p>
                    <p className="text-xs text-gray-500">{seller.salesCount} ventas</p>
                  </td>
                  <td className="py-3 text-right font-medium text-gray-700">
                    ${seller.totalSales.toFixed(2)}
                  </td>
                  <td className="py-3 text-right font-bold text-green-600">
                    ${seller.totalCommission.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-6 text-center text-gray-400 bg-gray-50 rounded-lg">
                  No hay ventas registradas este mes
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
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Detalle por Vendedor</h3>
          <p className="text-sm text-gray-500">Selecciona un vendedor para ver su historial detallado y comisiones.</p>
        </div>
        <select
          className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 p-2.5 outline-none transition-all"
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
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-md font-bold text-gray-800 uppercase tracking-wider">Historial de Ventas</h4>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold">Total Comisiones a Pagar</p>
                <p className="text-2xl font-bold text-green-600">${totalCommissionToPay.toFixed(2)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loadingDetails ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : history.length > 0 ? (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-50">
                      <th className="pb-3 font-medium">Fecha / Doc</th>
                      <th className="pb-3 font-medium">Producto</th>
                      <th className="pb-3 font-medium text-right">Cant.</th>
                      <th className="pb-3 font-medium text-right">Subtotal</th>
                      <th className="pb-3 font-medium text-right">Comisión (%)</th>
                      <th className="pb-3 font-medium text-right">Ganancia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <p className="font-medium text-gray-800">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">{item.type} #{item.documentNumber}</p>
                        </td>
                        <td className="py-4">
                          <p className="font-semibold text-gray-800">{item.productName}</p>
                          <p className="text-xs text-gray-500">ID: {item.productId}</p>
                        </td>
                        <td className="py-4 text-right text-gray-600">{item.quantity}</td>
                        <td className="py-4 text-right font-medium text-gray-800">${item.subtotal.toFixed(2)}</td>
                        <td className="py-4 text-right text-gray-500">{item.commissionRate}%</td>
                        <td className="py-4 text-right font-bold text-green-600">${item.commissionAmount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12 text-gray-400 italic bg-gray-50 rounded-xl">
                  No hay ventas registradas para este vendedor en el periodo seleccionado.
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-4 bg-indigo-50 rounded-full mb-4">
            <FaUsers className="h-10 w-10 text-indigo-500" />
          </div>
          <h4 className="text-xl font-bold text-gray-800">Selecciona un Vendedor</h4>
          <p className="text-gray-500 mt-2 max-w-xs mx-auto">
            Utiliza el menú superior para filtrar por vendedor y visualizar sus ventas y comisiones acumuladas.
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
    <div className="p-2 sm:p-4 bg-gray-50 min-h-full">
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido de nuevo, aquí tienes un resumen de tu negocio.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-1 relative w-full sm:w-auto">
            {['resumen', 'vendedores'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 relative z-10 ${activeTab === tab ? 'text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <span className="relative z-20">
                  {tab === 'resumen' ? 'Resumen General' : 'Vendedores'}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white shadow-[0_2px_8px_-2px_rgba(79,70,229,0.15)] rounded-xl border border-indigo-50/50"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="hidden sm:block w-px h-8 bg-gray-100 mx-2" />

          <div className="flex items-center bg-gray-50/80 px-4 py-2 rounded-xl border border-gray-100/50 transition-all hover:bg-white hover:border-indigo-100 group w-full sm:w-auto">
            <FaCalendarDays className="text-gray-400 group-hover:text-indigo-500 transition-colors mr-3 h-4 w-4" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent outline-none text-sm font-bold text-gray-700 cursor-pointer w-full sm:w-auto"
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
                color="bg-green-500"
                subtitle="vs mes anterior"
              />
              <StatCard
                title="Ganancias del Mes"
                value={`$${stats?.totalProfit.toFixed(2) || '0.00'}`}
                change={stats?.profitChange || 0}
                icon={FaChartLine}
                color="bg-blue-500"
                subtitle={`Margen: ${stats?.profitMargin || 0}%`}
              />
              <StatCard
                title="Total Clientes"
                value={stats?.totalCustomers.toString() || '0'}
                change={0}
                icon={FaUsers}
                color="bg-purple-500"
                subtitle="Registrados"
              />
              <StatCard
                title="Productos Activos"
                value={stats?.totalProducts.toString() || '0'}
                change={0}
                icon={FaBox}
                color="bg-orange-500"
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
