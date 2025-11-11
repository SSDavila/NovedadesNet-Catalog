'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FaTimes, FaSpinner, FaFileInvoiceDollar } from 'react-icons/fa';
import { Invoice } from '@/interfaces/invoice';
import { API_BASE_URL } from '@/lib/constants';
import { InvoicePreview } from './InvoicePreview';

interface InvoiceDetailModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export default function InvoiceDetailModal({ invoice, onClose }: InvoiceDetailModalProps) {
  const { data: invoiceDetail, isLoading, isError } = useQuery<Invoice>({
    queryKey: ['invoice', invoice?.invoiceId],
    queryFn: async () => {
      if (!invoice?.invoiceId) throw new Error('No ID provided');
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices/${invoice.invoiceId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error('No se pudo cargar el detalle de la factura.');
      }
      return response.json();
    },
    enabled: !!invoice && !!invoice.invoiceId,
  });

  const previewData = useMemo(() => {
    if (!invoiceDetail) return null;
    return {
      customer: {
        value: invoiceDetail.customer.customerId,
        label: `${invoiceDetail.customer.customerName} (${invoiceDetail.customer.customerIdentificationNumber})`,
        ruc: invoiceDetail.customer.customerIdentificationNumber,
        address: invoiceDetail.customer.customerAddress || '',
        phone: invoiceDetail.customer.customerPhone || '',
        email: invoiceDetail.customer.customerEmail,
      },
      items: invoiceDetail.items.map(item => ({
        ...item,
        productId: item.product.productSku || '',
        productName: item.product.productName,
        quantity: item.invoiceItemQuantity,
        price: Number(item.invoiceItemUnitPrice),
        discount: Number(item.invoiceItemDiscount),
        subtotal: (Number(item.invoiceItemUnitPrice) * item.invoiceItemQuantity) * (1 - Number(item.invoiceItemDiscount) / 100),
      })),
      paymentMethod: invoiceDetail.invoicePaymentMethod,
    };
  }, [invoiceDetail]);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-10 p-2 rounded-full bg-white/50 hover:bg-white">
          <FaTimes />
        </button>

        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><FaFileInvoiceDollar /> Detalle de Factura</h2>
        </div>

        <div className="p-8 flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 bg-gray-100">
          {isLoading && <div className="flex justify-center items-center h-full"><FaSpinner className="animate-spin text-blue-600 text-4xl" /></div>}
          {isError && <div className="text-center text-red-500">Error al cargar los detalles.</div>}
          {previewData && (
            <InvoicePreview data={previewData} />
          )}
        </div>

        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}