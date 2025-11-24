import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Invoice } from '@/interfaces/invoice';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useInvoices = () => {
  const queryClient = useQueryClient();
  const [processingInvoiceId, setProcessingInvoiceId] = useState<number | null>(null);

  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    isError: isErrorInvoices,
    error: errorInvoices,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`${API_URL}/invoices`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
  });

  const createInvoiceMutation = useMutation({
    mutationFn: async (newInvoice: any) => {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/invoices`, newInvoice, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Factura creada exitosamente');
    },
    onError: (error: any) => {
      toast.error('Error al crear factura: ' + (error.response?.data?.message || error.message));
    },
  });

  const authorizeInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: number) => {
      setProcessingInvoiceId(invoiceId);
      const token = localStorage.getItem('access_token');
      const response = await axios.post(`${API_URL}/sri/process-invoice/${invoiceId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Factura procesada con el SRI');
      if (data.status === 'AUTORIZADO') {
          toast.success('¡Factura Autorizada!');
      } else if (data.status === 'RECHAZADO') {
          toast.error('Factura Rechazada por el SRI');
      }
    },
    onError: (error: any) => {
      toast.error('Error al procesar factura: ' + (error.response?.data?.message || error.message));
    },
    onSettled: () => {
      setProcessingInvoiceId(null);
    }
  });

  const downloadRide = async (invoiceId: number) => {
    try {
        setProcessingInvoiceId(invoiceId);
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/sri/ride/${invoiceId}`, {
            responseType: 'blob',
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `factura-${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        toast.success('RIDE descargado');
    } catch (error: any) {
        toast.error('Error al descargar RIDE');
        console.error(error);
    } finally {
        setProcessingInvoiceId(null);
    }
  };

  const printInvoice = (id: number) => {
      console.log('Print', id);
      downloadRide(id); 
  };

  const downloadXml = (id: number) => {
      console.log('Download XML', id);
  };

  const sendEmail = (id: number) => {
      console.log('Send Email', id);
      toast.info('Funcionalidad de envío de email pendiente');
  };

  return {
    invoices,
    isLoadingInvoices,
    isErrorInvoices,
    errorInvoices,
    createInvoice: createInvoiceMutation.mutate,
    isCreatingInvoice: createInvoiceMutation.isPending,
    processingInvoiceId,
    authorizeInvoice: authorizeInvoiceMutation.mutate,
    printInvoice,
    downloadXml,
    sendEmail,
  };
};
