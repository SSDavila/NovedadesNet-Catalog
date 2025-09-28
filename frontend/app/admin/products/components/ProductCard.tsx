'use client';

import { FaEdit, FaTrash } from 'react-icons/fa';

export interface ProductImage {
  prodImageId: number;
  prodImageUrl: string;
}

export interface Product {
  prodId: string;
  prodName: string;
  prodDescription: string;
  prodPrice: number;
  prodStock: number;
  prodCategory: string;
  prodImages: ProductImage[];
}

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onDelete, onClick }: ProductCardProps) {
  const imageUrl = product.prodImages?.[0]?.prodImageUrl || 'https://via.placeholder.com/400';

  const getStockClasses = (stock: number) => {
    if (stock > 5) {
      return {
        dot: 'bg-green-500',
        bg: 'bg-green-100',
        text: 'text-green-800',
      };
    }
    if (stock >= 3) {
      return {
        dot: 'bg-yellow-500',
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
      };
    }
    if (stock >= 1) {
      return {
        dot: 'bg-orange-500',
        bg: 'bg-orange-100',
        text: 'text-orange-800',
      };
    }
    return { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-800' };
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative h-60 w-full overflow-hidden bg-gray-200 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img
          src={imageUrl}
          alt={product.prodName}
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(product);
            }}
            className="p-3 bg-white/80 rounded-full text-blue-600 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all"
            title="Editar producto"
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(product.prodId);
            }}
            className="p-3 bg-white/80 rounded-full text-red-600 backdrop-blur-sm hover:bg-white hover:scale-110 transition-all"
            title="Eliminar producto"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-gray-800 truncate" title={product.prodName}>
            <span aria-hidden="true" className="absolute inset-0" onClick={() => onClick(product)} />
            {product.prodName}
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-500">{product.prodCategory}</p>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-lg font-bold text-green-600">${product.prodPrice.toFixed(2)}</p>
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${getStockClasses(product.prodStock).bg} ${getStockClasses(product.prodStock).text}`}>
            <div className={`h-2 w-2 rounded-full ${getStockClasses(product.prodStock).dot}`}></div>
            {product.prodStock > 0 ? `${product.prodStock} en Stock` : 'Agotado'}
          </div>
        </div>
      </div>
    </div>
  );
}
