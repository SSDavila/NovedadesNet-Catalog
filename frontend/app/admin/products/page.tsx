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
    <div className="p-4 sm:p-10 bg-[#f8f9ff] min-h-screen">
      <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
              <FaBoxOpen />
            </div>
            Productos
          </h1>
          <p className="text-xs font-bold text-gray-500 mt-2 uppercase tracking-widest">
            Catálogo completo & Stock
          </p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="flex items-center gap-3 bg-gradient-to-br from-purple-600 to-indigo-700 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <FaPlus />
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
  );
}
