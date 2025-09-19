'use client';

import { useState } from 'react';
import { FaFolderPlus } from 'react-icons/fa';

import CategoryTable from './components/CategoryTable';
import NewCategoryModal from './components/NewCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';
import DeleteCategoryModal from './components/DeleteCategoryModal';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<string[]>([
    'Electrónica',
    'Hogar',
    'Ropa',
    'Deportes',
  ]);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // estados de modales
  const [isNewOpen, setIsNewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // notificación
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Funciones de manejo
  const handleAddCategory = (name: string) => {
    setCategories([...categories, name]);
    setToast({ message: `Categoría "${name}" creada`, type: 'success' });
  };

  const handleEditCategory = (newName: string) => {
    if (selectedIndex === null) return;
    const oldName = categories[selectedIndex];
    const updated = [...categories];
    updated[selectedIndex] = newName;
    setCategories(updated);
    setToast({ message: `Categoría "${oldName}" renombrada a "${newName}"`, type: 'success' });
  };

  const handleDeleteCategory = () => {
    if (selectedIndex === null) return;
    const name = categories[selectedIndex];
    setCategories(categories.filter((_, idx) => idx !== selectedIndex));
    setToast({ message: `Categoría "${name}" eliminada`, type: 'success' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Categorías</h1>
        <button
          onClick={() => setIsNewOpen(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow transition"
        >
          <FaFolderPlus />
          Nueva Categoría
        </button>
      </div>

      <CategoryTable
        categories={categories}
        onEdit={(idx) => {
          setSelectedIndex(idx);
          setIsEditOpen(true);
        }}
        onDelete={(idx) => {
          setSelectedIndex(idx);
          setIsDeleteOpen(true);
        }}
      />

      <NewCategoryModal
        isOpen={isNewOpen}
        onClose={() => setIsNewOpen(false)}
        onAdd={handleAddCategory}
      />

      <EditCategoryModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEditCategory}
        currentName={selectedIndex !== null ? categories[selectedIndex] : ''}
      />

      <DeleteCategoryModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCategory}
        categoryName={selectedIndex !== null ? categories[selectedIndex] : ''}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
