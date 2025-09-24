'use client';

import ProductCard from './ProductCard';
import { Product } from '@/interfaces/product';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p) => (
        <ProductCard key={p.prodId} product={p} />
      ))}
    </div>
  );
}
