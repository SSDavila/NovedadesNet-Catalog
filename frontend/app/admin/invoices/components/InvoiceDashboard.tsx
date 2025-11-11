'use client';

import { useMemo } from 'react';
import { Invoice } from '@/interfaces/invoice';
import { FaFileInvoiceDollar, FaClock, FaCheckCircle } from 'react-icons/fa';

interface InvoiceDashboardProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const StatCard = ({ icon, title, value, isLoading, colorClass }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5">
    <div className={`p-3 rounded-full ${colorClass}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {isLoading ? (
        <div className="h-7 w-24 bg-gray-200 rounded-md animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);

export default function InvoiceDashboard({ invoices, isLoading }: InvoiceDashboardProps) {
  const stats = useMemo(() => {
    if (!invoices) return { totalRevenue: 0, pending: 0, authorized: 0 };
    return {
      totalRevenue: invoices.reduce((acc, inv) => acc + Number(inv.invoiceTotal), 0),
      pending: invoices.filter(inv => inv.invoiceStatus === 'PENDIENTE').length,
      authorized: invoices.filter(inv => inv.invoiceStatus === 'AUTORIZADA').length,
    };
  }, [invoices]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard icon={<FaFileInvoiceDollar className="text-2xl text-blue-800" />} title="Ingresos Totales" value={formatCurrency(stats.totalRevenue)} isLoading={isLoading} colorClass="bg-blue-100" />
      <StatCard icon={<FaClock className="text-2xl text-yellow-800" />} title="Facturas Pendientes" value={stats.pending} isLoading={isLoading} colorClass="bg-yellow-100" />
      <StatCard icon={<FaCheckCircle className="text-2xl text-green-800" />} title="Facturas Autorizadas" value={stats.authorized} isLoading={isLoading} colorClass="bg-green-100" />
    </div>
  );
}