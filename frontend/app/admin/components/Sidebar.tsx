'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaBox,
  FaBars,
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

const logoutLink = [
  { href: '/logout', label: 'Cerrar Sesión', icon: FaSignOutAlt },
];

const sections = [
  { title: 'Principal', links: mainLinks },
  { title: 'Productos', links: productLinks },
  { title: 'Facturación', links: billingLinks },
  { title: 'Sistema', links: adminLinks },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
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
    <aside
      className={clsx(
        'h-screen bg-[#0f0c29] text-gray-100 flex flex-col shadow-2xl transition-all duration-500 ease-in-out relative z-40 border-r border-white/5',
        collapsed ? 'w-20' : 'w-72'
      )}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="flex items-center justify-between px-6 py-8 border-b border-white/5 relative z-10">
        <div className={clsx("flex items-center gap-3 transition-opacity duration-300", collapsed ? "opacity-0 invisible w-0" : "opacity-100")}>
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="font-black text-white text-xl">N</span>
          </div>
          <span className="font-black text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            Novedades
          </span>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto scrollbar-none relative z-10">
        {sections.map((section, index) => (
          <div key={section.title} className="space-y-3">
            {!collapsed && (
              <p className="px-4 text-[10px] uppercase font-black text-gray-500 tracking-[0.2em]">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={clsx(
                      "group relative flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300",
                      isActive ? "bg-white/10 shadow-lg" : "hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-pill-modern"
                        className="absolute left-0 w-1 h-6 bg-purple-500 rounded-full"
                        style={{ boxShadow: '0 0 15px #a855f7' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <div className={clsx(
                      "flex items-center gap-4 w-full transition-all duration-300",
                      collapsed && "justify-center"
                    )}>
                      <Icon
                        className={clsx(
                          "w-5 h-5 transition-all duration-300",
                          isActive ? "text-purple-400 scale-110" : "text-gray-500 group-hover:text-gray-300"
                        )}
                      />
                      {!collapsed && (
                        <span className={clsx(
                          "text-sm font-bold tracking-tight transition-colors duration-300",
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
            "group flex items-center gap-4 px-4 py-4 rounded-2xl w-full text-left transition-all duration-300 border border-transparent",
            "hover:bg-red-500/10 hover:border-red-500/20"
          )}
        >
          <div className={clsx(
            "flex items-center gap-4 w-full transition-all duration-300",
            collapsed && "justify-center"
          )}>
            <FaSignOutAlt className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
            {!collapsed && (
              <span className="text-sm font-bold text-gray-400 group-hover:text-red-400">
                Cerrar Sesión
              </span>
            )}
          </div>
        </button>
      </div>
    </aside>
  );
}
