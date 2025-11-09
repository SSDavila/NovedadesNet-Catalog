'use client';

import { FaBoxOpen, FaPlus } from 'react-icons/fa';
import { AdminProductCard } from './components/AdminProductCard';
import ConfirmationModal from '@/components/ConfirmationModal';
import { useProducts } from './useProducts';

export default function AdminProductsPage() {
  const {
    products,
    isLoading,
    isError,
    error,
    handleDeleteClick,
    confirmModalProps,
  } = useProducts();

  if (isError) return <div className="p-8 text-center text-red-600">Error: {error.message}</div>;

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBoxOpen />
            Administrar Productos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestiona el catálogo de tu tienda.
          </p>
        </div>
        <button
          // onClick={() => setIsModalOpen(true)} // Esto sería para un modal
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                onEdit={(p) => console.log('Edit:', p.productId)}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </main>
      <ConfirmationModal {...confirmModalProps} />
    </div>
  );
}
