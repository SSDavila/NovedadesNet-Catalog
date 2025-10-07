import { useState, useEffect, FormEvent } from 'react';

interface Category {
  categoryId: string;
  categoryName: string;
  categoryAbbreviation: string;
}

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCategory: Partial<Omit<Category, 'categoryId'>>) => void;
  category?: Category;
}

export default function EditCategoryModal({ isOpen, onClose, onSave, category }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryAbbreviation, setCategoryAbbreviation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setCategoryAbbreviation(category.categoryAbbreviation || '');
    }
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [category, isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave({ categoryName, categoryAbbreviation });
    setIsSubmitting(false);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'} bg-black/30 backdrop-blur-sm`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'animate-fadeIn'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Editar Categoría</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="editCategoryName" className="block text-sm font-medium text-gray-700">Nombre de la Categoría</label>
            <input
              type="text"
              id="editCategoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="editCategoryAbbreviation" className="block text-sm font-medium text-gray-700">Abreviatura (opcional)</label>
            <input
              type="text"
              id="editCategoryAbbreviation"
              value={categoryAbbreviation}
              onChange={(e) => setCategoryAbbreviation(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              maxLength={10}
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
              {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}