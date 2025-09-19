'use client';

import { FaTrash, FaEdit } from 'react-icons/fa';

interface CategoryTableProps {
  categories?: string[];
  onDelete: (index: number) => void;
  onEdit: (index: number) => void;
}

export default function CategoryTable({
  categories = [],
  onDelete,
  onEdit,
}: CategoryTableProps) {
  if (categories.length === 0) {
    return (
      <p className="mt-6 text-gray-500 text-center">
        No hay categorías creadas aún.
      </p>
    );
  }

  return (
    <div className="mt-6 overflow-x-auto rounded-lg shadow border border-gray-200">
      <table className="min-w-full bg-white rounded-lg">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-6 py-3 text-left font-medium">#</th>
            <th className="px-6 py-3 text-left font-medium">Nombre</th>
            <th className="px-6 py-3 text-center font-medium">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {categories.map((cat, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="px-6 py-3">{idx + 1}</td>
              <td className="px-6 py-3 font-medium text-gray-900">{cat}</td>
              <td className="px-6 py-3 flex justify-center gap-3">
                {/* Editar */}
                <div className="relative group">
                  <button
                    onClick={() => onEdit(idx)}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                    aria-label="Editar"
                  >
                    <FaEdit />
                  </button>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200">
                    Editar
                  </span>
                </div>

                {/* Eliminar */}
                <div className="relative group">
                  <button
                    onClick={() => onDelete(idx)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                    aria-label="Eliminar"
                  >
                    <FaTrash />
                  </button>
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200">
                    Eliminar
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
