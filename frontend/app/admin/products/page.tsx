'use client';

import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import { AdminProductCard } from './components/AdminProductCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useProducts } from './hooks/useProducts';
import NewProductModal from './components/NewProductModal';
import EditProductModal from './components/EditProductModal';

export default function AdminProductsPage() {
  const {
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
    confirmModalProps,
  } = useProducts();

  if (isError) return <div className="p-8 text-center text-red-600">Error: {error?.message || 'Ocurrió un error desconocido'}</div>;

  return (
    <div className="p-4 sm:p-12 min-h-screen bg-[#fcfcfd]">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 mb-14">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Catálogo</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Inventario & Productos</p>
            </div>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="flex items-center gap-3 bg-purple-600 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-soft hover:shadow-deep active:scale-95"
          >
            <FaPlus className="text-[10px]" />
            Nuevo Producto
          </button>
        </header>

        <main>
          {isLoading ? (
            <div className="text-center p-8 text-gray-500">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <AdminProductCard
                  key={product.productId}
                  product={product}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </main>
        <ConfirmationModal {...confirmModalProps} />
        <NewProductModal
          isOpen={isNewModalOpen}
          onClose={handleCloseNewModal}
          createProductMutation={createProductMutation}
        />
        <EditProductModal
          product={productToEdit}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          updateProductMutation={updateProductMutation}
        />
      </div>
    </div>
  );
}
