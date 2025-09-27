'use client';

import { FaEdit, FaTrash } from "react-icons/fa";

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

  return (
    <div
      onClick={() => onClick(product)}
      className="group relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
    >
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.prodName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col flex-grow p-4">
        <div className="flex-grow">
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
            {product.prodCategory}
          </span>
          <h3 className="mt-1 text-lg font-bold text-gray-800 tracking-tight truncate" title={product.prodName}>
            {product.prodName}
          </h3>
        </div>

        <div className="flex justify-between items-center mt-6">
          <span className="text-2xl font-extrabold text-green-700">
            ${product.prodPrice.toFixed(2)}
          </span>
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                product.prodStock > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}
            ></div>
            <span className="text-sm font-medium text-gray-600">
              {product.prodStock > 0 ? `${product.prodStock} en stock` : 'Agotado'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 p-3 bg-gray-50/75 border-t border-gray-100">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product);
          }}
          className="p-2 rounded-lg text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product.prodId);
          }}
          className="p-2 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors"
        >
          <FaTrash size={14} />
        </button>
      </div>
    </div>
  );
}
