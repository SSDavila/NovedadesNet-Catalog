import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Invoice } from '@/interfaces/invoice';
import { InvoiceFormData } from '../components/NewInvoiceModal';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { API_BASE_URL } from '@/lib/constants';

export type InvoiceAction = 'view' | 'authorize' | 'print' | 'downloadXml' | 'sendEmail';

export function useInvoices() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  // --- Queries ---
  const { data: invoices = [], isLoading, isError, error } = useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No estás autenticado. Por favor, inicia sesión.');
      }

      const response = await fetch(`${API_BASE_URL}/invoices`, {
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

  // --- Mutations ---

  const createInvoiceMutation = useMutation({
    mutationFn: async (data: InvoiceFormData) => {
      if (!data.customer) throw new Error('Cliente no seleccionado');

      const payload = {
        customerId: data.customer.value,
        paymentMethod: data.paymentMethod,
        items: data.items.map(item => ({
          productId: item.productId,
          quantity: Number(item.quantity),
          discount: Number(item.discount),
        })),
      };

      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices`, {
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
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const authorizeInvoiceMutation = useMutation({
    mutationKey: ['authorizeInvoice'],
    mutationFn: async (invoiceId: string) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/authorize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al autorizar la factura');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Factura autorizada correctamente.', 'success');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const printInvoiceMutation = useMutation({
    mutationKey: ['printInvoice'],
    mutationFn: async (invoiceId: string) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/print`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al generar el PDF de la factura');
      }

      const blob = await response.blob();
      const pdfUrl = URL.createObjectURL(blob);
      window.open(pdfUrl, '_blank');
    },
    onSuccess: () => {
      addNotification('PDF de la factura generado.', 'info');
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const downloadXmlMutation = useMutation({
    mutationKey: ['downloadXml'],
    mutationFn: async (invoiceId: string) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/download-xml`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al descargar el XML');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${invoiceId}.xml`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
    onSuccess: () => addNotification('XML descargado correctamente.', 'success'),
    onError: (error: Error) => addNotification(error.message, 'error'),
  });

  const sendEmailMutation = useMutation({
    mutationKey: ['sendEmail'],
    mutationFn: async (invoiceId: string) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/send-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al enviar el correo');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Correo enviado correctamente.', 'success');
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  return {
    invoices,
    isLoading,
    isError,
    error,
    createInvoice: createInvoiceMutation.mutate,
    isCreatingInvoice: createInvoiceMutation.isPending,
    authorizeInvoice: authorizeInvoiceMutation.mutate,
    isAuthorizingInvoice: authorizeInvoiceMutation.isPending,
    printInvoice: printInvoiceMutation.mutate,
    isPrintingInvoice: printInvoiceMutation.isPending,
    downloadXml: downloadXmlMutation.mutate,
    isDownloadingXml: downloadXmlMutation.isPending,
    sendEmail: sendEmailMutation.mutate,
    isSendingEmail: sendEmailMutation.isPending,
  };
}