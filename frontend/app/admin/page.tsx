'use client';

import { useDashboardData } from '@/hooks/useDashboardData';
import { IconType } from 'react-icons';
import { FaDollarSign, FaUsers, FaBox, FaChartLine, FaArrowTrendUp, FaArrowTrendDown, FaStar, FaReceipt } from 'react-icons/fa6';
import { formatDistanceToNow } from 'date-fns';
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
              <span className={`text-xs px-2 py-1 rounded-full ${
                sale.status === 'AUTORIZADO' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
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

export default function DashboardPage() {
  const { stats, monthlyCustomers, monthlyProfit, recentSales, bestSellers, loading, error } = useDashboardData();

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
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido de nuevo, aquí tienes un resumen de tu negocio.</p>
      </header>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProductsWidget products={bestSellers} />
        <RecentSalesWidget sales={recentSales} />
      </div>
    </div>
  );
}
