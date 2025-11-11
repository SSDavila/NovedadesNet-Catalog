'use client';

import { useState } from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import InvoiceCard from './InvoiceCard';
import InvoiceCardSkeleton from './InvoiceCardSkeleton';

interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: 'AUTORIZADA' | 'PENDIENTE' | 'ANULADA' | 'RECHAZADA' | string;
  date: string;
}

interface InvoiceListProps {
  invoices: Invoice[];
  onAction: (action: string, invoiceId: string) => void;
  isLoading: boolean;
  isAuthorizing: boolean;
  isPrinting: boolean;
  isDownloadingXml: boolean;
  isSendingEmail: boolean;
}

export default function InvoiceList({
  invoices,
  onAction,
  isLoading,
  isAuthorizing,
  isPrinting,
  isDownloadingXml,
  isSendingEmail,
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[...Array(6)].map((_, i) => <InvoiceCardSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por N° o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/2 md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">Todos los estados</option>
          <option value="AUTORIZADA">Autorizada</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="RECHAZADA">Rechazada</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInvoices.map((invoice) => (
          <InvoiceCard key={invoice.id} invoice={invoice} onAction={onAction} />
        ))}
      </div>
      {filteredInvoices.length === 0 && (
        <div className="text-center py-16 text-gray-500 bg-gray-50 rounded-lg">
          <FaFileInvoiceDollar className="mx-auto text-4xl text-gray-400" />
          <p className="mt-4 text-lg font-semibold">No se encontraron facturas</p>
          <p className="mt-1 text-sm">Intenta ajustar tu búsqueda, filtros o crea una nueva factura.</p>
        </div>
      )}
    </div>
  );
}
