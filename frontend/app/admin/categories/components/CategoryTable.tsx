import { FaEdit, FaTrash } from 'react-icons/fa';
import { Icon } from '@iconify/react';
import { Category } from '@/interfaces';

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Icono</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Abreviatura</th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.categoryId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <Icon icon={category.categoryIcon || 'mdi:tag-off-outline'} className="w-6 h-6 text-gray-400" />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.categoryName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.categoryAbbreviation}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(category)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                  aria-label={`Editar ${category.categoryName}`}
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="text-red-600 hover:text-red-900"
                  aria-label={`Eliminar ${category.categoryName}`}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}