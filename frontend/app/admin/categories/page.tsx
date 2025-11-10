'use client';

import { FaPlus, FaBoxOpen } from 'react-icons/fa';
import CategoryTable from './components/CategoryTable';
import NewCategoryModal from './components/NewCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { Category } from '@/interfaces';
import { useCategories } from './hooks/useCategories';

export default function CategoriesPage() {
  const {
    categories,
    isLoading,
    error,
    isNewModalOpen,
    handleOpenNewModal,
    handleCloseNewModal,
    isEditModalOpen,
    categoryToEdit,
    handleEditClick,
    handleCloseEditModal,
    updateCategoryMutation,
    handleDeleteClick,
    confirmDeleteModalProps,
  } = useCategories();

  if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando categorías...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaBoxOpen />
            Gestión de Categorías
          </h1>
          <p className="text-gray-600 mt-1">Crea, edita y elimina las categorías de tus productos.</p>
        </div>
        <button
          onClick={handleOpenNewModal}
          className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Nueva Categoría
        </button>
      </header>

      <NewCategoryModal
        isOpen={isNewModalOpen}
        onClose={handleCloseNewModal}
        onCategoryCreated={handleCloseNewModal}
      />

      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSave={(updatedCategory: Partial<Omit<Category, 'categoryId'>>) => updateCategoryMutation.mutate({ categoryId: categoryToEdit!.categoryId, ...updatedCategory } as Category)}
        category={categoryToEdit}
      />

      <ConfirmationModal {...confirmDeleteModalProps} />

      <main>
        <CategoryTable categories={categories} onEdit={handleEditClick} onDelete={handleDeleteClick} />
      </main>
    </div>
  );
}