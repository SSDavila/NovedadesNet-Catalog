import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow p-4 mb-6">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Novedades Net</h1>
        <nav>
          <Link href="/" className="mr-4 hover:text-blue-500">Home</Link>
          <Link href="/products" className="hover:text-blue-500">Productos</Link>
        </nav>
      </div>
    </header>
  );
}
