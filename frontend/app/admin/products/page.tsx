'use client';

import { useState, useEffect } from 'react';
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

  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 12;

  // Calculate pagination (always at least 1 page so pagination appears even if < 12 products)
  const totalPages = Math.max(1, Math.ceil(products.length / PRODUCTS_PER_PAGE));
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [products.length, totalPages, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

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

        <main className="space-y-8">
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
            <>
              {/* Grid 2 per row on mobile, up to 4 on desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {paginatedProducts.map((product) => (
                  <AdminProductCard
                    key={product.productId}
                    product={product}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>

              {/* Pagination Controls - always rendered */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium order-2 sm:order-1">
                  Mostrando {products.length > 0 ? startIndex + 1 : 0}–{Math.min(startIndex + PRODUCTS_PER_PAGE, products.length)} de {products.length} productos
                </p>

                <div className="flex items-center gap-1.5 sm:gap-2 order-1 sm:order-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                    aria-label="Página anterior"
                  >
                    ‹
                  </button>

                  {getPageNumbers().map((page, idx) =>
                    page === 'ellipsis' ? (
                      <span key={`ellipsis-${idx}`} className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-gray-400 text-xs select-none">
                        …
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl text-xs font-bold transition-all border ${
                          currentPage === page
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
                            : 'border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    )
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl border border-gray-200 text-gray-600 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs"
                    aria-label="Página siguiente"
                  >
                    ›
                  </button>
                </div>
              </div>
            </>
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
