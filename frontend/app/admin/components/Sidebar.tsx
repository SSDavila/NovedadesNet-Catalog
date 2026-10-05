'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBox,
  FaTags,
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaFileAlt,
  FaSignOutAlt,
  FaUsers,
  FaWarehouse,
  FaUserTie,
  FaBuilding,
  FaCog,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const mainLinks = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
];

const productLinks = [
  { href: '/admin/products', label: 'Productos', icon: FaBox },
  { href: '/admin/categories', label: 'Categorías', icon: FaTags },
  { href: '/admin/inventory', label: 'Inventario', icon: FaWarehouse },
];

const billingLinks = [
  { href: '/admin/invoices', label: 'Facturas', icon: FaFileInvoiceDollar },
  { href: '/admin/salesnotes', label: 'Notas de Venta', icon: FaFileAlt },
  { href: '/admin/customers', label: 'Clientes', icon: FaUserTie },
];

const adminLinks = [
  { href: '/admin/usersadmin', label: 'Usuarios', icon: FaUsers },
  { href: '/admin/company', label: 'Mi Empresa', icon: FaBuilding },
  { href: '/admin/settings', label: 'Ajustes', icon: FaCog },
];

const sections = [
  { title: 'Principal', links: mainLinks },
  { title: 'Productos', links: productLinks },
  { title: 'Facturación', links: billingLinks },
  { title: 'Sistema', links: adminLinks },
];

// Flat list for bottom nav (most-used links)
const bottomNavLinks = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/products', label: 'Productos', icon: FaBox },
  { href: '/admin/invoices', label: 'Facturas', icon: FaFileInvoiceDollar },
  { href: '/admin/customers', label: 'Clientes', icon: FaUserTie },
  { href: '/admin/inventory', label: 'Inventario', icon: FaWarehouse },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/auth/logout', {
        method: 'POST',
      });
      if (response.ok) {
        localStorage.removeItem('accessToken');
        router.push('/site/login');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <>
      {/* ── DESKTOP SIDEBAR (hidden on mobile) ─────────────────────────── */}
      <aside
        className={clsx(
          'hidden md:flex h-screen bg-[#0a0a0f] text-gray-400 flex-col shadow-xl transition-all duration-500 ease-in-out relative z-40 border-r border-white/5',
          collapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 relative z-10">
          <div className={clsx("flex items-center gap-3 transition-opacity duration-300", collapsed ? "opacity-0 invisible w-0" : "opacity-100")}>
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/20">
              <span className="font-bold text-white text-lg">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Novedades
            </span>
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <FaChevronRight className="w-3 h-3" /> : <FaChevronLeft className="w-3 h-3" />}
          </button>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-6 overflow-y-auto scrollbar-none relative z-10">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              {!collapsed && (
                <p className="px-3 text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-4">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.links.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={clsx(
                        "group relative flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                        isActive ? "bg-white/5 text-white" : "hover:text-gray-200"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="active-pill-minimal"
                          className="absolute left-0 w-0.5 h-4 bg-purple-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                        />
                      )}
                      <div className={clsx(
                        "flex items-center gap-3 w-full transition-all duration-200",
                        collapsed && "justify-center"
                      )}>
                        <Icon className={clsx(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300"
                        )} />
                        {!collapsed && (
                          <span className={clsx(
                            "text-sm font-medium transition-colors duration-200",
                            isActive ? "text-white" : "text-gray-400 group-hover:text-gray-200"
                          )}>
                            {label}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 relative z-10">
          <button
            onClick={handleLogout}
            className={clsx(
              "group flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left transition-all duration-200",
              "hover:bg-rose-500/5"
            )}
          >
            <div className={clsx("flex items-center gap-3 w-full", collapsed && "justify-center")}>
              <FaSignOutAlt className="w-4 h-4 text-gray-500 group-hover:text-rose-400 transition-colors" />
              {!collapsed && (
                <span className="text-sm font-medium text-gray-500 group-hover:text-rose-400">
                  Cerrar Sesión
                </span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ─────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f] border-b border-white/5 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white text-sm">N</span>
          </div>
          <span className="font-bold text-white text-base tracking-tight">Novedades</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all"
          aria-label="Abrir menú"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      {/* ── MOBILE FULL-SCREEN MENU (drawer) ───────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%', opacity: 0.8 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0.8 }}
              transition={{ type: 'spring', damping: 27, stiffness: 280 }}
              className="absolute top-0 left-0 bottom-0 w-72 bg-[#0a0a0f] flex flex-col shadow-2xl border-r border-white/5"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/30">
                    <span className="font-bold text-white text-lg">N</span>
                  </div>
                  <span className="font-bold text-lg tracking-tight text-white">Novedades</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-all"
                  aria-label="Cerrar menú"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-4 py-6 space-y-5 overflow-y-auto scrollbar-none">
                {sections.map((section) => (
                  <div key={section.title} className="space-y-1">
                    <p className="px-3 text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-3">
                      {section.title}
                    </p>
                    {section.links.map(({ href, label, icon: Icon }) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={() => setMobileOpen(false)}
                          className={clsx(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                            isActive ? "bg-white/10 text-white font-semibold" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                          )}
                        >
                          <Icon className={clsx("w-4 h-4", isActive ? "text-purple-400" : "text-gray-500")} />
                          <span className="text-sm">{label}</span>
                          {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500" />}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </nav>

              {/* Logout */}
              <div className="p-4 border-t border-white/5 mt-auto">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-3 rounded-lg w-full text-left hover:bg-rose-500/10 group transition-all"
                >
                  <FaSignOutAlt className="w-4 h-4 text-gray-500 group-hover:text-rose-400 transition-colors" />
                  <span className="text-sm font-medium text-gray-500 group-hover:text-rose-400">Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE BOTTOM NAV BAR ──────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f] border-t border-white/5 flex items-center justify-around px-2 py-2 safe-area-pb">
        {bottomNavLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-all min-w-[52px]",
                isActive ? "text-purple-400" : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className={clsx("text-[9px] font-bold uppercase tracking-wider", isActive ? "text-purple-400" : "text-gray-600")}>
                {label.split(' ')[0]}
              </span>
              {isActive && <div className="w-1 h-1 rounded-full bg-purple-500" />}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
