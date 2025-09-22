'use client';

import { useState, useEffect, FormEvent } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import CategoryTable from './components/CategoryTable';
import NewCategoryModal from './components/NewCategoryModal';
import EditCategoryModal from './components/EditCategoryModal';

interface Category {
  categoryId: number;
  categoryName: string;
}

type ModalState = 
  | { type: 'none' }
  | { type: 'new' }
  | { type: 'edit', category: Category };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>({ type: 'none' });

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      if (!response.ok) {
        throw new Error('Error al obtener las categorías');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpdate = async (newName: string) => {
    if (modalState.type !== 'edit') return;

    try {
      const response = await fetch(`${API_URL}/categories/${modalState.category.categoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newName }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar la categoría.');
      }
      await fetchCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return;

    try {
      const response = await fetch(`${API_URL}/categories/${categoryId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al eliminar la categoría.');
      }
      await fetchCategories();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Categorías</h1>
        <button
          onClick={() => setModalState({ type: 'new' })}
          className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
        >
          Nueva Categoría
        </button>
      </div>

      <NewCategoryModal
        isOpen={modalState.type === 'new'}
        onClose={() => setModalState({ type: 'none' })}
        onCategoryCreated={() => {
          setModalState({ type: 'none' });
          fetchCategories();
        }}
      />

      <EditCategoryModal
        isOpen={modalState.type === 'edit'}
        onClose={() => setModalState({ type: 'none' })}
        onSave={handleUpdate}
        currentName={modalState.type === 'edit' ? modalState.category.categoryName : ''}
      />

      {/* Tabla de categorías */}
      {isLoading && <p className="text-center py-4">Cargando categorías...</p>}
      {error && <p className="text-center py-4 text-red-500">{error}</p>}
      {!isLoading && !error && (
        <CategoryTable categories={categories} onEdit={(category) => setModalState({ type: 'edit', category })} onDelete={handleDelete} />
      )}
    </div>
  );
}