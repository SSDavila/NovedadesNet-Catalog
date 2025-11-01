'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invoice } from '@/interfaces/invoice';
import { FaFileInvoiceDollar, FaPlus } from 'react-icons/fa';
import InvoiceList from './components/InvoiceList';
import InvoiceModal from './components/InvoiceModal';
import NewInvoiceModal from './components/NewInvoiceModal';
import { InvoiceFormData } from './components/NewInvoiceModal';
import { useNotification } from '@/components/Notifications/NotificationContext';

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: invoices = [], isLoading, isError, error } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {

      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        throw new Error('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.');
      }
      if (!response.ok) {
        throw new Error('No se pudieron cargar las facturas.');
      }
      return response.json();
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      if (!data.customer) throw new Error('Cliente no seleccionado');

      const payload = {
        customerId: data.customer.value,
        items: data.items.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          discount: Number(item.discount),
        })),
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear la factura');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Factura creada con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setIsNewInvoiceModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleViewInvoice = (invoiceId: string) => {
    const invoice = invoices.find(inv => inv.invoiceId.toString() === invoiceId);
    setSelectedInvoice(invoice || null);
  };

  if (isError) return <div className="p-8 text-center text-red-600">Error: {(error as Error).message}</div>;

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
        <button
          onClick={() => setIsNewInvoiceModalOpen(true)}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nueva Factura
        </button>
      </header>

      <main>
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando facturas...</p>
        ) : (
          <InvoiceList
            invoices={invoices.map(inv => ({
              id: inv.invoiceId.toString(),
              invoiceNumber: inv.invoiceNumber,
              customerName: inv.customer.customerName,
              total: inv.invoiceTotal,
              status: inv.invoiceStatus,
              date: new Date(inv.invoiceCreatedAt).toLocaleDateString(),
            }))}
            onView={(invoice) => handleViewInvoice(invoice.id)}
          />
        )}
      </main>

      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      <NewInvoiceModal
        isOpen={isNewInvoiceModalOpen}
        onClose={() => setIsNewInvoiceModalOpen(false)}
        onSubmit={(data) => createInvoiceMutation.mutate(data)}
        isSubmitting={createInvoiceMutation.isPending}
      />
    </div>
  );
}
