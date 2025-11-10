'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <Link href="/site" className="flex items-center gap-3">
                <Image
                  src="/Logo-NovedadesNet.png"
                  alt="Novedades Net Logo"
                  width={40}
                  height={40}
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text">
                  NovedadesNet
                </span>
              </Link>
            </div>
            <nav className="hidden md:flex gap-6">
              <Link
                href="/site"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Inicio
              </Link>
              <Link
                href="/site/products"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Productos
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/site/login"
              className="hidden sm:block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
            >
              Iniciar Sesión
            </Link>
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="Abrir menú"
              >
                {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden"
          >
            <nav className="flex flex-col items-center gap-2 py-4 border-t border-gray-200/80">
              <Link href="/site" className="w-full text-center py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
              <Link href="/site/products" className="w-full text-center py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors" onClick={() => setIsMenuOpen(false)}>Productos</Link>
              <div className="mt-2 w-full px-4 sm:hidden">
                <Link
                  href="/site/login"
                  className="block w-full text-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Iniciar Sesión
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
