'use client';

import { useCallback, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';

export function useProducts() {
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const {
    data: products = [],
    isLoading,
    isError,
    error,
  } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No estás autenticado.');

      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('No se pudieron cargar los productos.');
      return response.json();
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        throw new Error(message || 'Error al crear el producto');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Producto creado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsNewModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleOpenNewModal = () => setIsNewModalOpen(true);
  const handleCloseNewModal = () => setIsNewModalOpen(false);

  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, formData }: { productId: string; formData: FormData }) => {
      const token = localStorage.getItem('access_token');
      if (!token) throw new Error('No estás autenticado.');

      console.log('--- DEBUG: Enviando petición PATCH para actualizar ---');
      console.log('ID del Producto:', productId);

      for (let [key, value] of formData.entries()) {
        console.log(`FormData: ${key}:`, value);
      }

      const updateResponse = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        throw new Error(message || 'Error al actualizar el producto.');
      }

      return updateResponse.json();
    },
    onSuccess: () => {
      addNotification('Producto actualizado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleEditClick = useCallback((product: Product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => setIsEditModalOpen(false), []);

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al eliminar el producto.');
      }
      return productId;
    },
    onSuccess: () => {
      addNotification('Producto eliminado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete.productId);
    }
  };

  return {
    products,
    isLoading,
    isError,
    error,
    handleDeleteClick,
    handleOpenNewModal,
    isNewModalOpen,
    handleCloseNewModal,
    createProductMutation,
    productToEdit,
    isEditModalOpen,
    handleEditClick,
    handleCloseEditModal,
    updateProductMutation,
    confirmModalProps: {
      isOpen: isConfirmModalOpen,
      onClose: () => setIsConfirmModalOpen(false),
      onConfirm: handleConfirmDelete,
      title: 'Confirmar Eliminación',
      message: `¿Estás seguro de que quieres eliminar el producto "${productToDelete?.productName}"? Esta acción no se puede deshacer.`,
      isConfirming: deleteProductMutation.isPending,
    },
  };
}