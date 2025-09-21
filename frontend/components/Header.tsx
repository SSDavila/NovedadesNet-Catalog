'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Link href="/site" className="text-2xl font-bold text-gray-900">
                NovedadesNet
              </Link>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link href="/site" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Home
              </Link>
              <Link href="/site/products" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Productos
              </Link>
            </nav>
          </div>
          <div className="flex items-center">
            <Link href="/site/login" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
