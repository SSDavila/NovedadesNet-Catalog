'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { SaleNote } from '@/interfaces';
import { SaleNoteFormData } from '../components/NewSaleNoteForm';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';

const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('Token de autenticación no encontrado.');
  }
  return { Authorization: `Bearer ${token}` };
};

const fetchSaleNotesAPI = async (): Promise<SaleNote[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/sale-notes`, { headers: getAuthHeaders() });
  return data;
};

const createSaleNoteAPI = async (formData: SaleNoteFormData): Promise<SaleNote> => {
  if (!formData.customer) throw new Error('Cliente no seleccionado');

  const payload = {
    customerId: formData.customer.value,
    items: formData.items.map(item => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    })),
  };

  const { data } = await axios.post(`${API_BASE_URL}/sale-notes`, payload, { headers: getAuthHeaders() });
  return data;
};

export const useSaleNotes = () => {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: saleNotes = [], isLoading, isError, error } = useQuery<SaleNote[], Error>({
    queryKey: ['saleNotes'],
    queryFn: fetchSaleNotesAPI,
    enabled: !!getAuthToken(),
    onError: (err: any) => {
      if (err instanceof AxiosError && err.response?.status === 401) {
        addNotification('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'error');
      } else {
        addNotification(err.message || 'No se pudieron cargar las notas de venta.', 'error');
      }
    },
  });

  const createSaleNoteMutation = useMutation<SaleNote, Error, SaleNoteFormData>({
    mutationFn: createSaleNoteAPI,
    onSuccess: () => {
      addNotification('Nota de Venta creada con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['saleNotes'] });
    },
    onError: (error: any) => {
      addNotification(error.response?.data?.message || error.message, 'error');
    },
  });

  return {
    saleNotes,
    isLoadingSaleNotes: isLoading,
    isErrorSaleNotes: isError,
    errorSaleNotes: error,
    createSaleNote: createSaleNoteMutation.mutate,
    isCreatingSaleNote: createSaleNoteMutation.isPending,
  };
};