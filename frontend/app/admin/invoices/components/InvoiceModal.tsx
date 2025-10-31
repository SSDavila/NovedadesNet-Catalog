'use client';

import { Invoice } from '@/interfaces/invoice';
import { FaTimes } from 'react-icons/fa';

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Detalle de Factura</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <FaTimes size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">N° Factura</p>
            <p className="text-lg font-mono text-gray-900">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Cliente</p>
            <p className="text-lg text-gray-900">{invoice.customer.customerName}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total</p>
            <p className="text-lg font-bold text-gray-900">${invoice.invoiceTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}