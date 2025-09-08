import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Bienvenido a Novedades Net</h1>
      <p className="mb-4">Explora todos nuestros productos al por mayor y menor.</p>
      <Link href="/products" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Ver Productos
      </Link>
    </div>
  );
}
