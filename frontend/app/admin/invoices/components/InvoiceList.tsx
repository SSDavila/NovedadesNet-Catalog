'use client';

import { useState, useMemo } from 'react';
import { Invoice } from '@/interfaces/invoice';
import InvoiceCard from './InvoiceCard';

interface InvoiceListProps {
  invoices: Invoice[];
  onAction: (action: string, invoiceId: number) => void;
  processingInvoiceId: number | null;
}

export default function InvoiceList({
  invoices,
  onAction,
  processingInvoiceId,
}: InvoiceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredInvoices = useMemo(() => invoices.filter(invoice => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
        invoice.customer.customerName.toLowerCase().includes(searchLower) ||
        invoice.customer.customerIdentificationNumber.includes(searchLower);
      const matchesStatus = statusFilter === 'ALL' || invoice.invoiceStatus === statusFilter;
      return matchesSearch && matchesStatus;
    }), [invoices, searchTerm, statusFilter]);

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por N°, cliente o RUC/Cédula..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">Todos</option>
          <option value="AUTORIZADO">Autorizado</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="NO AUTORIZADO">No Autorizado</option>
          <option value="RECHAZADO">Rechazado</option>
          <option value="ANULADA">Anulada</option>
        </select>
      </div>

      {filteredInvoices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((invoice) => (
            <InvoiceCard
              key={invoice.invoiceId}
              invoice={invoice}
              onAction={onAction}
              isProcessing={processingInvoiceId === invoice.invoiceId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">No se encontraron facturas con esos criterios.</div>
      )}
    </div>
  );
}
