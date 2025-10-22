'use client';

import { useState, useEffect } from 'react';
import { IconType } from 'react-icons';
import { FaDollarSign, FaUsers, FaBox, FaChartBar, FaClockRotateLeft, FaStar, FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';

interface StatCardProps {
  icon: IconType;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: string;
}

const StatCard = ({ icon: Icon, title, value, change, isPositive, color }: StatCardProps) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="text-white h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      {isPositive ? (
        <FaArrowTrendUp className="text-green-500 h-4 w-4 mr-1" />
      ) : (
        <FaArrowTrendDown className="text-red-500 h-4 w-4 mr-1" />
      )}
      <span className={isPositive ? 'text-green-600' : 'text-red-600'}>{change}</span>
      <span className="text-gray-500 ml-1">vs mes anterior</span>
    </div>
  </div>
);

const SalesChart = () => {
  const salesData = [
    { name: 'Ene', value: 1200 }, { name: 'Feb', value: 1900 }, { name: 'Mar', value: 1500 },
    { name: 'Abr', value: 2800 }, { name: 'May', value: 2200 }, { name: 'Jun', value: 3400 },
    { name: 'Jul', value: 2900 }, { name: 'Ago', value: 4100 },
  ];
  const maxSale = Math.max(...salesData.map(d => d.value));

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg col-span-1 lg:col-span-2 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaChartBar className="text-indigo-500" />
        Resumen de Ventas
      </h3>
      <div className="mt-6 h-64 flex items-end gap-4">
        {salesData.map(data => (
          <div key={data.name} className="flex-1 flex flex-col items-center gap-2">
            <div
              className="w-full bg-indigo-200 rounded-t-lg hover:bg-indigo-400 transition-all duration-300"
              style={{ height: `${(data.value / maxSale) * 100}%` }}
              title={`$${data.value}`}
            ></div>
            <span className="text-xs font-medium text-gray-500">{data.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const RecentActivity = () => {
  const activities = [
    { id: 1, text: 'Nueva venta #1234 por $150.00', time: 'hace 5m' },
    { id: 2, text: 'Nuevo cliente registrado: Ana G.', time: 'hace 2h' },
    { id: 3, text: 'Producto "Lámpara LED" bajo en stock', time: 'hace 8h' },
    { id: 4, text: 'Nueva venta #1233 por $89.99', time: 'hace 1d' },
    { id: 5, text: 'Actualización de producto: "Silla Gamer"', time: 'hace 2d' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaClockRotateLeft className="text-sky-500" />
        Actividad Reciente
      </h3>
      <ul className="mt-4 space-y-4">
        {activities.map(activity => (
          <li key={activity.id} className="flex items-start">
            <div className="bg-sky-100 rounded-full p-2">
              <FaArrowTrendUp className="h-4 w-4 text-sky-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-700">{activity.text}</p>
              <p className="text-xs text-gray-400">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TopProducts = () => {
  const products = [
    { id: 1, name: 'Lámpara Inteligente Solari', sales: 120, image: '/placeholder.png' },
    { id: 2, name: 'Silla Gamer Ergonómica', sales: 98, image: '/placeholder.png' },
    { id: 3, name: 'Teclado Mecánico RGB', sales: 74, image: '/placeholder.png' },
  ];

  // Solución para el error de hidratación: generar precios solo en el cliente
  const [randomPrices, setRandomPrices] = useState<string[]>([]);

  useEffect(() => {
    // Este código solo se ejecuta en el navegador, después del renderizado inicial
    setRandomPrices(
      products.map(() => (Math.random() * 100 + 50).toFixed(2))
    );
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <FaStar className="text-amber-500" />
        Top Productos
      </h3>
      <ul className="mt-4 space-y-3">
        {products.map((product, index) => (
          <li key={product.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-md object-cover bg-gray-200" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
              <p className="text-xs text-gray-500">{product.sales} ventas</p>
            </div>
            <p className="text-sm font-bold text-gray-900">
              {randomPrices[index] ? `$${randomPrices[index]}` : '...'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function DashboardPage() {
  return (
    <div className="p-2 sm:p-4 bg-gray-50 min-h-full">

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido de nuevo, aquí tienes un resumen de tu negocio.</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">

        <StatCard
          title="Ventas Totales (Mes)"
          value="$12,450"
          change="+12.5%"
          isPositive={true}
          icon={FaDollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Nuevos Clientes"
          value="82"
          change="+3.2%"
          isPositive={true}
          icon={FaUsers}
          color="bg-blue-500"
        />
        <StatCard
          title="Productos en Stock"
          value="1,230"
          change="-1.8%"
          isPositive={false}
          icon={FaBox}
          color="bg-orange-500"
        />
        <StatCard
          title="Tasa de Conversión"
          value="4.8%"
          change="+0.5%"
          isPositive={true}
          icon={FaArrowTrendUp}
          color="bg-purple-500"
        />

        <div className="lg:col-span-2">
          <SalesChart />
        </div>

        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        <div className="lg:col-span-4">
          <TopProducts />
        </div>
      </div>
    </div>
  );
}
