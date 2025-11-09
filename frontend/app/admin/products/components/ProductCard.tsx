'use client';
import { Product } from '@/interfaces';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onClick: (product: Product) => void;
}
export default function ProductCard({ product, onEdit, onDelete, onClick }: ProductCardProps) {
  const imageUrl = product.images?.[0]?.productImageUrl || 'https://via.placeholder.com/400';

  const getStockClasses = (stock: number) => {
    if (stock > 5) {
      return { dot: 'bg-green-500', bg: 'bg-green-100', text: 'text-green-800' };
    }
    if (stock >= 3) {
      return { dot: 'bg-yellow-500', bg: 'bg-yellow-100', text: 'text-yellow-800' };
    }
    if (stock >= 1) {
      return { dot: 'bg-orange-500', bg: 'bg-orange-100', text: 'text-orange-800' };
    }
    return { dot: 'bg-red-500', bg: 'bg-red-100', text: 'text-red-800' };
  };

  const stockClasses = getStockClasses(product.productStock);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
      <div
        className="relative h-60 w-full overflow-hidden bg-gray-200 cursor-pointer"
        onClick={() => onClick(product)}
      >
        <img
          src={imageUrl}
          alt={product.productName}
          className="h-full w-full object-cover object-center"
        />       
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h3 className="text-base font-bold text-gray-800 truncate" title={product.productName}>
            <span aria-hidden="true" className="absolute inset-0" onClick={() => onClick(product)} />
            {product.productName}
          </h3>
          <p className="mt-1 text-xs font-medium text-gray-500">{product.category?.categoryName}</p>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <p className="text-lg font-bold text-green-600">${product.productPrice.toFixed(2)}</p>
          <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold ${stockClasses.bg} ${stockClasses.text}`}>
            <div className={`h-2 w-2 rounded-full ${stockClasses.dot}`}></div>
            {product.productStock > 0 ? `${product.productStock} en Stock` : 'Agotado'}
          </div>
        </div>
      </div>
    </div>
  );
}
