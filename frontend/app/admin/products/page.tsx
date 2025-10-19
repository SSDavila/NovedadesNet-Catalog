'use client';

import { useState } from 'react';
import { FaPlus, FaSpinner, FaBoxOpen } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import NewProductModal from './components/NewProductModal';
import EditProductModal from './components/EditProductModal';
import ProductDetailModal from './components/ProductDetailModal';
import ConfirmationModal from './components/ConfirmationModal';
import ProductGrid from './components/ProductGrid';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { Product } from '@/interfaces';

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { addNotification } = useNotification();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, isError, error } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok) {
        throw new Error('No se pudieron obtener los productos.');
      }
      const data = await response.json();
      return data.map((p: any) => ({
        ...p,
        productPrice: Number(p.productPrice),
      }));
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'No se pudo eliminar el producto.');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      addNotification('Producto eliminado correctamente', 'success');
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
      closeDetailModal();
    },
    onError: (err: Error) => {
      addNotification(err.message, 'error');
      setIsConfirmModalOpen(false);
      setProductToDelete(null);
    },
  });

  const handleProductAdded = () => {
    setIsModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    addNotification('Producto añadido con éxito', 'success');
  };

  const handleProductUpdated = () => {
    setIsEditModalOpen(false);
    queryClient.invalidateQueries({ queryKey: ['products'] });
    addNotification('Producto actualizado con éxito', 'success');
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProductMutation.mutate(productToDelete);
    }
  };

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center p-10"><FaSpinner className="animate-spin text-4xl text-blue-600" /></div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error.message}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaBoxOpen />
          Administrar Productos
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nuevo Producto
        </button>
      </div>

      {!isLoading && !isError && (
        <ProductGrid
          products={products}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onClick={handleCardClick}
        />
      )}

      <NewProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onProductAdded={handleProductAdded} />

      {selectedProduct && (
        <ProductDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          product={selectedProduct}
          onEdit={handleEdit}
          onDelete={() => handleDeleteClick(selectedProduct.productId)}
        />
      )}

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
        isConfirming={deleteProductMutation.isPending}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        initialData={selectedProduct ? {
          productId: selectedProduct.productId,
          productName: selectedProduct.productName, 
          productDescription: selectedProduct.productDescription, 
          productPrice: selectedProduct.productPrice.toString(), 
          productStock: selectedProduct.productStock.toString(), 
          categoryId: selectedProduct.categoryId, 
          images: selectedProduct.images
        } : { productId: '', productName: '', productDescription: '', productPrice: '', productStock: '', categoryId: '', images: [] }}
        onProductUpdated={handleProductUpdated}
      /> 
    </div>
  );
}