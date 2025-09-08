'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import Filters from './Filters';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion?: string;
  rating: number;
  stock: number;
}

interface ProductsGridProps {
  products: Product[];
}

export default function ProductsGrid({ products }: ProductsGridProps) {
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleFilterChange = (filters: { stock?: boolean; minRating?: number }) => {
    let filtered = products;
    if (filters.stock) filtered = filtered.filter(p => p.stock > 0);
    if (filters.minRating) filtered = filtered.filter(p => p.rating >= filters.minRating);
    setFilteredProducts(filtered);
  };

  return (
    <div>
      <Filters onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-gray-500 col-span-full">No se encontraron productos.</p>
        )}
      </div>
    </div>
  );
}
