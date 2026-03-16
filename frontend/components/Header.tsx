'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/site' },
    { name: 'Productos', href: '/site/products' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-6">
      {/* Permanent Floating Navigation with Texture */}
      <nav className={`max-w-6xl mx-auto transition-all duration-500 overflow-hidden rounded-2xl border bg-white/60 backdrop-blur-xl relative group ${scrolled
        ? 'border-purple-200/40 shadow-[0_12px_40px_rgba(107,33,168,0.12)]'
        : 'border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)]'
        }`}>
        {/* Subtle Background Texture Layer */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#6b21a8 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

        {/* Main Content */}
        <div className="px-6 h-[72px] flex items-center justify-between relative z-10">
          <div className="flex items-center gap-10">
            {/* Integrated Logo & Stacked Typography */}
            <Link href="/site" className="flex items-center gap-3 active:scale-95 transition-transform">
              <div className="relative transform group-hover:rotate-12 transition-transform duration-500">
                <Image
                  src="/Logo-NovedadesNet.png"
                  alt="Logo"
                  width={42}
                  height={42}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-purple-800 uppercase tracking-[0.15em] leading-none">
                  Novedades
                </span>
                <span className="text-[14px] font-black bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text uppercase tracking-[0.45em] leading-none mt-1">
                  Net
                </span>
              </div>
            </Link>

            {/* Desktop Navigation - Larger Links */}
            <ul className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className={`relative px-5 py-2 text-[12px] font-black uppercase tracking-[0.2em] transition-all duration-300 rounded-xl group/item ${isActive ? 'text-purple-700' : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {isActive ? (
                        <motion.div
                          layoutId="header-pill"
                          className="absolute inset-0 bg-purple-100/40 border border-purple-200/30 rounded-xl z-0"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-100/0 group-hover/item:bg-slate-100/80 rounded-xl transition-all duration-300 z-0 scale-90 opacity-0 group-hover/item:scale-100 group-hover/item:opacity-100" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {/* Floating Acceso Button */}
            <Link
              href="/site/login"
              className="hidden sm:flex items-center gap-3 px-7 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.25em] border border-white/5 shadow-lg hover:shadow-purple-300/40 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-800/0 via-white/5 to-purple-800/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
              <FaUserCircle size={14} className="group-hover/btn:text-purple-400 transition-colors" />
              <span>Acceso</span>
            </Link>

            {/* Mobile Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900/5 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300"
              >
                {isMenuOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <div className="fixed inset-0 top-24 px-4 pointer-events-none z-[60]">
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              className="bg-white/95 backdrop-blur-2xl p-6 rounded-[2.5rem] shadow-2xl border border-white/50 pointer-events-auto max-w-sm ml-auto relative overflow-hidden"
            >
              <div className="relative z-10 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center justify-between p-5 rounded-2xl text-[12px] font-black uppercase tracking-[0.2em] transition-all ${pathname === link.href
                      ? 'bg-purple-600 text-white shadow-xl shadow-purple-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-purple-50'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                    <div className={`w-2 h-2 rounded-full ${pathname === link.href ? 'bg-yellow-400' : 'bg-slate-300'}`} />
                  </Link>
                ))}
                <Link
                  href="/site/login"
                  className="mt-4 flex items-center justify-center gap-4 p-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.25em] shadow-xl shadow-slate-300/40"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUserCircle size={18} />
                  <span>Acceso</span>
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
