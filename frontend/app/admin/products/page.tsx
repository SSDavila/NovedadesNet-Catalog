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

  return (
    <div className="p-4 sm:p-8 md:p-12 min-h-screen bg-[#fcfcfd]">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 mb-8 sm:mb-14">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Gestión de Catálogo</h1>
            <div className="flex items-center gap-2 mt-1 sm:mt-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">Inventario & Productos</p>
            </div>
          </div>
          <button
            onClick={handleOpenNewModal}
            className="flex items-center justify-center gap-2.5 bg-purple-600 text-white px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-soft hover:shadow-deep active:scale-95 w-full sm:w-auto shrink-0"
          >
            <FaPlus className="text-[10px]" />
            Nuevo Producto
          </button>
        </header>

        <main>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="text-sm font-medium">Cargando productos...</p>
            </div>
          ) : isError || products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-gray-100 shadow-soft gap-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                <FaBoxOpen className="text-3xl" />
              </div>
              <div>
                <p className="text-gray-900 text-lg font-bold">No existen productos aún</p>
                <p className="text-gray-400 text-sm mt-1 max-w-sm">
                  {isError
                    ? 'No se pudieron sincronizar los productos o el catálogo está vacío.'
                    : 'Comienza agregando el primer producto a tu catálogo virtual.'}
                </p>
              </div>
              <button
                onClick={handleOpenNewModal}
                className="mt-2 flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all"
              >
                <FaPlus className="text-[10px]" />
                Agregar Producto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
