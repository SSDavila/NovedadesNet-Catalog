'use client';

import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onClick: (product: Product) => void;
}

export default function ProductGrid({ products, onEdit, onDelete, onClick }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.prodId}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          onClick={onClick}
        />
      ))}
    </div>
  );
}