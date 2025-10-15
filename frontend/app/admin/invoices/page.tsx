'use client';

import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import InvoiceList from './components/InvoiceList';

const mockInvoices = [
  { id: '1', invoiceNumber: '001-001-000000123', customerName: 'Ana Gómez', total: 150.75, status: 'AUTORIZADA', date: '2024-05-20' },
  { id: '2', invoiceNumber: '001-001-000000124', customerName: 'Carlos Sánchez', total: 89.99, status: 'PENDIENTE', date: '2024-05-21' },
  { id: '3', invoiceNumber: '001-001-000000125', customerName: 'Lucía Fernández', total: 450.00, status: 'ANULADA', date: '2024-05-18' },
];

export default function InvoicesPage() {
  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaFileInvoiceDollar />
            Facturación
          </h1>
          <p className="text-gray-600 mt-1">Crea y administra tus facturas electrónicas.</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Nueva Factura
        </button>
      </header>

      <main>
        <InvoiceList invoices={mockInvoices} />
      </main>
    </div>
  );
}

