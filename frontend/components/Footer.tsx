'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 relative z-10">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          <div className="md:col-span-5 lg:col-span-6">
            <Link href="/site" className="flex items-center gap-3">
              <Image
                src="/Logo-NovedadesNet.png"
                alt="Novedades Net Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text">
                NovedadesNet
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-md">
              Descubre lo último en productos novedosos. Te traemos los artículos más innovadores y sorprendentes del mercado.
            </p>
          </div>

          <div className="md:col-span-7 lg:col-span-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Ponte en Contacto</h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="https://wa.me/+593963988846"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-base text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <FaWhatsapp />
                      <span>WhatsApp</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="mailto:contacto@novedadesnet.com"
                      className="inline-flex items-center gap-3 text-base text-gray-600 hover:text-purple-600 transition-colors"
                    >
                      <FaEnvelope />
                      <span>Email</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 tracking-wider uppercase">Síguenos</h3>
                <div className="flex mt-4 space-x-6">
                  <a href="#" className="text-gray-400 hover:opacity-80 transition-opacity duration-200">
                    <span className="sr-only">Facebook</span>
                    <FaFacebook size={28} className="text-blue-600" />
                  </a>
                  <a href="#" className="text-gray-400 hover:opacity-80 transition-opacity duration-200">
                    <span className="sr-only">Instagram</span>
                    <FaInstagram size={28} className="text-pink-600" />
                  </a>
                  <a href="#" className="text-gray-400 hover:opacity-80 transition-opacity duration-200">
                    <span className="sr-only">WhatsApp</span>
                    <FaWhatsapp size={28} className="text-green-500" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} NovedadesNet. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
