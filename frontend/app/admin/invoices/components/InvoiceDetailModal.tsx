'use client';

import { useMemo } from 'react';
import { FaTimes, FaFileInvoiceDollar } from 'react-icons/fa';
import { Invoice } from '@/interfaces/invoice';
import { InvoicePreview } from './InvoicePreview';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const previewData = useMemo(() => {
    if (!invoice) return null;
    return {
      customer: {
        value: invoice.customer.customerId,
        label: `${invoice.customer.customerName} (${invoice.customer.customerIdentificationNumber})`,
        ruc: invoice.customer.customerIdentificationNumber,
        address: invoice.customer.customerAddress || 'N/A',
        phone: invoice.customer.customerPhone || 'N/A',
        email: invoice.customer.customerEmail || 'N/A',
      },
      items: invoice.items.map(item => ({
        productId: item.product.productId,
        productName: item.product.productName,
        quantity: item.invoiceItemQuantity,
        price: Number(item.invoiceItemUnitPrice),
        discount: Number(item.invoiceItemDiscount),
        subtotal: Number(item.invoiceItemSubtotal),
      })),
      paymentMethod: invoice.invoicePaymentMethod,
    };
  }, [invoice]);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FaFileInvoiceDollar /> Detalle de Factura</h2>
            <p className="text-sm text-gray-500">N° {invoice.invoiceNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100">
            <FaTimes />
          </button>
        </header>
        
        <main className="p-8 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-gray-50">
          {previewData && <InvoicePreview data={previewData} />}
        </main>
        
        <footer className="flex justify-end gap-3 p-4 bg-gray-100 border-t rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
}