'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/interfaces';
import { useNotification } from '@/components/Notifications/NotificationContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) throw new Error('Error al obtener las categorías');
  return response.json();
}

async function updateCategory(data: { categoryId: string } & Partial<Omit<Category, 'categoryId'>>): Promise<Category> {
  const { categoryId, ...updateData } = data;
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al actualizar la categoría.');
  }
  return response.json();
}

async function deleteCategory(categoryId: string): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al eliminar la categoría.');
  }
}

export function useCategories() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | undefined>(undefined);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: categories = [], isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const updateCategoryMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addNotification('Categoría actualizada con éxito', 'success');
      handleCloseEditModal();
    },
    onError: (error) => {
      addNotification(`Error al actualizar: ${error.message}`, 'error');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      addNotification('Categoría eliminada con éxito', 'success');
      handleCloseConfirmDelete();
    },
    onError: (error) => {
      addNotification(`Error al eliminar: ${error.message}`, 'error');
    },
  });

  const handleEditClick = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => setIsEditModalOpen(false);
  const handleOpenNewModal = () => setIsNewModalOpen(true);
  const handleCloseNewModal = () => setIsNewModalOpen(false);

  const handleDeleteClick = useCallback((category: Category) => {
    setCategoryToDelete(category);
    setIsConfirmDeleteOpen(true);
  }, []);

  const handleCloseConfirmDelete = useCallback(() => {
    setIsConfirmDeleteOpen(false);
    setCategoryToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.categoryId);
    }
  }, [categoryToDelete, deleteCategoryMutation]);

  return {
    categories, isLoading, error: error?.message || null,
    isNewModalOpen, handleOpenNewModal, handleCloseNewModal,
    isEditModalOpen, categoryToEdit, handleEditClick, handleCloseEditModal, updateCategoryMutation,
    handleDeleteClick,
    confirmDeleteModalProps: {
      isOpen: isConfirmDeleteOpen,
      onClose: handleCloseConfirmDelete,
      onConfirm: handleConfirmDelete,
      title: `Eliminar Categoría: "${categoryToDelete?.categoryName || ''}"`,
      message: '¿Estás seguro de que quieres eliminar esta categoría? Esta acción no se puede deshacer.',
      isConfirming: deleteCategoryMutation.isPending,
      confirmText: 'Eliminar',
    },
  };
}