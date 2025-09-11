'use client';

import ProductCard from './ProductCard';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
  descripcion: string;
  imagen: string;
}

interface ProductGridProps {
  productos: Producto[];
}

export default function ProductGrid({ productos }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {productos.map((p) => (
        <ProductCard key={p.id} {...p} />
      ))}
    </div>
  );
}
