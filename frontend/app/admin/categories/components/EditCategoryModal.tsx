import { useState, useEffect, FormEvent } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { useDebounce } from '../hooks/useDebounce'; // Asegúrate que la ruta es correcta
import { Category } from '@/interfaces';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedCategory: Partial<Omit<Category, 'categoryId'>>) => void;
  category?: Category;
}

const IconPicker = ({ selectedIcon, onSelect }: { selectedIcon: string, onSelect: (iconName: string) => void }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery) {
      setIsSearching(true);
      fetch(`https://api.iconify.design/search?query=${debouncedQuery}&limit=30`)
        .then(res => res.json())
        .then(data => setResults(data.icons || []))
        .finally(() => setIsSearching(false));
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  return (
    <div>
      <div className="relative mb-2">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar icono (ej: laptop, car, gift...)" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm" />
      </div>
      {isSearching && <p className="text-sm text-gray-500">Buscando...</p>}
      <div className="h-48 overflow-y-auto grid grid-cols-6 gap-2 p-2 border rounded-lg bg-gray-50">
        {results.length > 0 ? results.map((iconName) => (
          <button key={iconName} type="button" onClick={() => onSelect(iconName)} className={`flex items-center justify-center p-3 rounded-lg transition-all ${selectedIcon === iconName ? 'bg-purple-600 text-white scale-110 shadow-lg' : 'bg-gray-200 text-gray-600 hover:bg-purple-100 hover:text-purple-700'}`}>
            <Icon icon={iconName} className="w-5 h-5" />
          </button>
        )) : (
          selectedIcon && <div className="col-span-1 flex items-center justify-center p-3 rounded-lg bg-purple-600 text-white"><Icon icon={selectedIcon} className="w-5 h-5" /></div>
        )}
      </div>
    </div>
  );
};

export default function EditCategoryModal({ isOpen, onClose, onSave, category }: EditCategoryModalProps) {
  const [categoryName, setCategoryName] = useState('');
  const [categoryAbbreviation, setCategoryAbbreviation] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('mdi:tag');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (category) {
      setCategoryName(category.categoryName);
      setCategoryAbbreviation(category.categoryAbbreviation || '');
      setSelectedIcon(category.categoryIcon || 'mdi:tag');
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
    await onSave({ categoryName, categoryAbbreviation, categoryIcon: selectedIcon });
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
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Icono</label>
            <IconPicker selectedIcon={selectedIcon} onSelect={setSelectedIcon} />
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