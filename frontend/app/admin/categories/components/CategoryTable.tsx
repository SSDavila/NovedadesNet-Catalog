'use client';

import { FaEdit, FaTrash } from 'react-icons/fa';

interface Category {
  categoryId: number;
  categoryName: string;
}

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: number) => void;
}

export default function CategoryTable({ categories, onEdit, onDelete }: CategoryTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nombre
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {categories.map((category) => (
            <tr key={category.categoryId}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.categoryId}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.categoryName}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button onClick={() => onEdit(category)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition" aria-label="Editar">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(category.categoryId)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition" aria-label="Eliminar">
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