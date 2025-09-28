export default function Footer() {
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white shadow p-4 mt-6">
      <div className="container mx-auto text-center text-gray-500">
        &copy; {new Date().getFullYear()} Novedades Net. Todos los derechos reservados.
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div className="md:col-span-1">
            <Link href="/site" className="flex items-center gap-3">
              <Image
                src="/Logo-NovedadesNet.png" // Asegúrate que tu logo esté en /public
                alt="Novedades Net Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 text-transparent bg-clip-text">
                NovedadesNet
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">
              Tu tienda de confianza para los productos más innovadores.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Navegación</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/site" className="text-base text-gray-400 hover:text-white transition-colors">Inicio</Link></li>
              <li><Link href="/site/products" className="text-base text-gray-400 hover:text-white transition-colors">Productos</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Contacto</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="https://wa.me/+593963988846" target="_blank" rel="noopener noreferrer" className="text-base text-gray-400 hover:text-white transition-colors">WhatsApp</a></li>
              <li><a href="mailto:contacto@novedadesnet.com" className="text-base text-gray-400 hover:text-white transition-colors">contacto@novedadesnet.com</a></li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase">Síguenos</h3>
            <div className="flex mt-4 space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Facebook</span><FaFacebook size={24} /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">Instagram</span><FaInstagram size={24} /></a>
              <a href="https://wa.me/+593963988846" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><span className="sr-only">WhatsApp</span><FaWhatsapp size={24} /></a>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} NovedadesNet. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
