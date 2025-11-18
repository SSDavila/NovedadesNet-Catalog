import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Invoice } from '@/interfaces/invoice';
import { InvoiceFormData } from './components/NewInvoiceModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

const fetchInvoices = async (): Promise<Invoice[]> => {
  const { data } = await axios.get(`${API_URL}/invoices`, { headers: getAuthHeaders() });
  return data;
};

const postInvoice = async (newInvoice: InvoiceFormData): Promise<Invoice> => {
  const { data } = await axios.post(`${API_URL}/invoices`, newInvoice, { headers: getAuthHeaders() });
  return data;
};

const fetchInvoiceById = async (invoiceId: number): Promise<Invoice> => {
  const { data } = await axios.get(`${API_URL}/invoices/${invoiceId}`, { headers: getAuthHeaders() });
  return data;
};

const processInvoiceManually = async (invoiceId: number) => {
  const { data } = await axios.post(`${API_URL}/sri/process-invoice/${invoiceId}`, {}, { headers: getAuthHeaders() });
  return data;
};

export const useInvoices = () => {
  const queryClient = useQueryClient();
  const [pollingInvoiceId, setPollingInvoiceId] = useState<number | null>(null);

  const {
    data: invoices = [],
    isLoading: isLoadingInvoices,
    isError: isErrorInvoices,
    error: errorInvoices,
  } = useQuery<Invoice[], Error>({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });

  // Query para el sondeo (polling) de una factura específica.
  useQuery<Invoice, Error>({
    queryKey: ['invoice', pollingInvoiceId],
    queryFn: () => fetchInvoiceById(pollingInvoiceId!),
    // Solo se ejecuta si pollingInvoiceId tiene un valor numérico.
    enabled: typeof pollingInvoiceId === 'number',
    // La función de intervalo de sondeo.
    refetchInterval: (query) => {
      const invoiceStatus = query.state.data?.invoiceStatus;
      // Detiene el sondeo si la factura alcanza un estado final.
      if (['AUTORIZADO', 'NO AUTORIZADO', 'RECHAZADO', 'ANULADA'].includes(invoiceStatus || '')) {
        return false;
      }
      // Continúa sondeando cada 3 segundos.
      return 3000;
    },
    onSuccess: (updatedInvoice) => {
      // Añadimos un guard para asegurarnos que updatedInvoice no es undefined.
      if (updatedInvoice) {
        queryClient.setQueryData<Invoice[]>(['invoices'], (oldData = []) =>
          oldData.map((inv) =>
            inv.invoiceId === updatedInvoice.invoiceId ? { ...inv, ...updatedInvoice } : inv
          )
        );
        // Detiene el sondeo si el estado es final.
        if (['AUTORIZADO', 'NO AUTORIZADO', 'RECHAZADO', 'ANULADA'].includes(updatedInvoice.invoiceStatus)) {
          setPollingInvoiceId(null);
        }
      }
    },
    onError: () => {
      // Detiene el sondeo si hay un error al buscar la factura.
      setPollingInvoiceId(null);
    },
    // No reintentar automáticamente en caso de error durante el sondeo.
    retry: false,
  });

  // Mutación para crear una factura.
  const { mutate: createInvoice, isPending: isCreatingInvoice } = useMutation<Invoice, Error, InvoiceFormData>({
    mutationFn: postInvoice,
    onSuccess: (newlyCreatedInvoice) => {
      // Agrega la nueva factura a la caché y comienza el sondeo.
      queryClient.setQueryData<Invoice[]>(['invoices'], (oldData = []) => [newlyCreatedInvoice, ...oldData]);
      setPollingInvoiceId(newlyCreatedInvoice.invoiceId);
    },
  });

  // Mutación para autorizar manualmente una factura.
  const { mutate: authorizeInvoice, isPending: isAuthorizingInvoice, variables: authorizingInvoiceId } = useMutation<unknown, Error, number>({
    mutationFn: processInvoiceManually,
    onSuccess: (_, invoiceId) => {
      // Comienza el sondeo para la factura que se está reintentando.
      setPollingInvoiceId(invoiceId);
    },
    onError: (error) => {
      console.error("Error al intentar autorizar manualmente:", error);
    },
  });

  const printInvoice = (id: number) => console.log('Printing', id);
  const isPrintingInvoice = false;
  const printingInvoiceId = null;

  const downloadXml = (id: number) => console.log('Downloading XML', id);
  const isDownloadingXml = false;
  const downloadingXmlInvoiceId = null;

  const sendEmail = (id: number) => console.log('Sending Email', id);
  const isSendingEmail = false;
  const sendingEmailInvoiceId = null;

  return {
    invoices,
    isLoadingInvoices,
    isErrorInvoices,
    errorInvoices,

    createInvoice,
    isCreatingInvoice,

    // ID unificado para saber qué factura se está procesando.
    processingInvoiceId: pollingInvoiceId || (isAuthorizingInvoice ? authorizingInvoiceId : null),

    authorizeInvoice,
    isAuthorizingInvoice,
    authorizingInvoiceId,

    printInvoice,
    isPrintingInvoice,
    printingInvoiceId,

    downloadXml,
    isDownloadingXml,
    downloadingXmlInvoiceId,

    sendEmail,
    isSendingEmail,
    sendingEmailInvoiceId,
  };
};