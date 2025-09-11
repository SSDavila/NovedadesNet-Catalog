import ProductsGrid from './components/ProductsGrid';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  descripcion?: string;
  rating: number;
  stock: number;
}

export default function ProductsPage() {
  // Dummy data o fetch desde backend
  const products: Product[] = [
    { id: 1, nombre: 'Auriculares', precio: 59.99, imagen: '/images/headphones.jpg', descripcion: 'Auriculares bluetooth', rating: 4, stock: 12 },
    { id: 2, nombre: 'Teclado', precio: 89.99, imagen: '/images/keyboard.jpg', descripcion: 'Teclado mecánico', rating: 5, stock: 0 },
    { id: 3, nombre: 'Mouse', precio: 39.99, imagen: '/images/mouse.jpg', descripcion: 'Mouse gamer', rating: 3, stock: 7 },
    { id: 4, nombre: 'Smartwatch', precio: 129.99, imagen: '/images/smartwatch.jpg', descripcion: 'Smartwatch deportivo', rating: 5, stock: 4 },
  ];

  return (
    <div className="px-4 py-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>
      <ProductsGrid products={products} />
    </div>
  );
}
