'use client';

import { ProductStock } from '@/interfaces';
import { FaEdit } from 'react-icons/fa';

interface ProductStockTableProps {
  products: ProductStock[];
  onAdjustStock: (product: ProductStock) => void;
}

const getStockClass = (stock: number) => {
  if (stock === 0) return 'text-red-600 font-bold';
  if (stock > 0 && stock <= 10) return 'text-yellow-600 font-semibold';
  return 'text-gray-800';
};

export default function ProductStockTable({ products, onAdjustStock }: ProductStockTableProps) {
  if (products.length === 0) {
    return <div className="text-center py-12 text-gray-500">No se encontraron productos.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-800 uppercase font-semibold">
          <tr>
            <th scope="col" className="px-6 py-3">Producto</th>
            <th scope="col" className="px-6 py-3">SKU</th>
            <th scope="col" className="px-6 py-3">Categoría</th>
            <th scope="col" className="px-6 py-3 text-center">Stock Actual</th>
            <th scope="col" className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                {product.productName}
              </th>
              <td className="px-6 py-4 font-mono">{product.productSku || '-'}</td>
              <td className="px-6 py-4">{product.category?.categoryName || 'Sin categoría'}</td>
              <td className={`px-6 py-4 text-center text-lg ${getStockClass(product.productStock)}`}>
                {product.productStock}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onAdjustStock(product)}
                  className="flex items-center gap-2 ml-auto bg-gray-200 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-300 transition-colors text-xs font-semibold"
                  title="Ajustar Stock"
                >
                  <FaEdit />
                  Ajustar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}