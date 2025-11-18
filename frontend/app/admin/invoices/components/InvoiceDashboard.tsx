'use client';

import { useMemo } from 'react';
import { FaFileInvoiceDollar, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { Invoice } from '@/interfaces/invoice';

interface InvoiceDashboardProps {
  invoices: Invoice[];
  isLoading: boolean;
}

const StatCard = ({ icon, title, value, isLoading, colorClass }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-5 transition-all duration-300">
    <div className={`p-3 rounded-full ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {isLoading ? (
        <div className="h-7 w-24 bg-gray-200 rounded-md animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      )}
    </div>
  </div>
);

export default function InvoiceDashboard({ invoices, isLoading }: InvoiceDashboardProps) {
  const stats = useMemo(() => ({
    totalRevenue: invoices.reduce((acc, inv) => inv.invoiceStatus === 'AUTORIZADO' ? acc + Number(inv.invoiceTotal) : acc, 0),
    pending: invoices.filter(inv => !['AUTORIZADO', 'NO AUTORIZADO', 'RECHAZADO', 'ANULADA'].includes(inv.invoiceStatus)).length,
    authorized: invoices.filter(inv => inv.invoiceStatus === 'AUTORIZADO').length,
    failed: invoices.filter(inv => ['NO AUTORIZADO', 'RECHAZADO'].includes(inv.invoiceStatus)).length,
  }), [invoices]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<FaFileInvoiceDollar className="text-2xl text-blue-800" />} title="Ingresos (Autorizados)" value={formatCurrency(stats.totalRevenue)} isLoading={isLoading} colorClass="bg-blue-100" />
      <StatCard icon={<FaCheckCircle className="text-2xl text-green-800" />} title="Autorizadas" value={stats.authorized} isLoading={isLoading} colorClass="bg-green-100" />
      <StatCard icon={<FaClock className="text-2xl text-yellow-800" />} title="En Proceso" value={stats.pending} isLoading={isLoading} colorClass="bg-yellow-100" />
      <StatCard icon={<FaExclamationTriangle className="text-2xl text-red-800" />} title="Con Errores" value={stats.failed} isLoading={isLoading} colorClass="bg-red-100" />
    </div>
  );
}