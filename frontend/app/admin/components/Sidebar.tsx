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
        'h-screen bg-[#0a0a0f] text-gray-400 flex flex-col shadow-xl transition-all duration-500 ease-in-out relative z-40 border-r border-white/5',
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
        {sections.map((section, index) => (
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
                      <Icon
                        className={clsx(
                          "w-4 h-4 transition-colors",
                          isActive ? "text-purple-400" : "text-gray-500 group-hover:text-gray-300"
                        )}
                      />
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
          <div className={clsx(
            "flex items-center gap-3 w-full transition-all duration-200",
            collapsed && "justify-center"
          )}>
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
  );
}
