'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="md:col-span-1">
            <Link href="/site" className="flex items-center gap-3">
              <Image
                src="/Logo-NovedadesNet.png"
                alt="Novedades Net Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-green-500 text-transparent bg-clip-text">
                NovedadesNet
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              Tu tienda de confianza para los productos más innovadores.
            </p>
          </div>

          {/* Links Section */}
          <div className="md:col-start-2">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/site" className="text-base text-gray-600 hover:text-blue-600 transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/site/products" className="text-base text-gray-600 hover:text-blue-600 transition-colors">Productos</Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Contacto</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://wa.me/+593963988846" target="_blank" rel="noopener noreferrer" className="text-base text-gray-600 hover:text-blue-600 transition-colors">WhatsApp</a>
              </li>
              <li>
                <a href="mailto:contacto@novedadesnet.com" className="text-base text-gray-600 hover:text-blue-600 transition-colors">contacto@novedadesnet.com</a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Síguenos</h3>
            <div className="flex mt-4 space-x-6">
              <a href="#" className="text-blue-600 hover:text-blue-700 transform hover:scale-110 transition-transform duration-200">
                <span className="sr-only">Facebook</span>
                <FaFacebook size={24} />
              </a>
              <a href="#" className="transform hover:scale-110 transition-transform duration-200">
                <span className="sr-only">Instagram</span>
                <FaInstagram size={24} className="text-pink-600" />
              </a>
              <a
                href="https://wa.me/+593963988846"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 transform hover:scale-110 transition-transform duration-200"
              >
                <span className="sr-only">WhatsApp</span>
                <FaWhatsapp size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NovedadesNet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
