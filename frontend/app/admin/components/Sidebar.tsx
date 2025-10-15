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
} from 'react-icons/fa';
import { motion } from 'framer-motion';
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
        'h-screen bg-neutral-900 text-gray-100 flex flex-col shadow-xl transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b border-neutral-800">
        <span className={clsx('font-bold text-xl tracking-tight', collapsed && 'hidden')}>
          Admin
        </span>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 rounded hover:bg-neutral-800 transition"
          aria-label="Toggle sidebar"
        >
          <FaBars className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-4">
        {sections.map((section, index) => (
          <div key={section.title}>
            {collapsed && index > 0 && <hr className="mx-4 border-neutral-700" />}
            {!collapsed && (
              <p className="px-4 text-xs uppercase text-gray-500 mb-2 tracking-wide mt-4">
                {section.title}
              </p>
            )}
            <div className={clsx('space-y-1', collapsed && 'mt-4')}>
              {section.links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative flex items-center gap-3 px-4 py-2 rounded-lg"
                >
                  {pathname === href && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-green-600 rounded-lg"
                      transition={{ type: 'spring', duration: 0.5 }}
                    />
                  )}
                  <div
                  className={clsx(
                      'relative z-10 flex items-center gap-3 w-full',
                      collapsed && 'justify-center'
                    )}
                  >
                    <Icon
                      className={clsx(
                        'w-5 h-5 flex-shrink-0 transition-colors',
                        pathname === href ? 'text-white' : 'text-gray-400 group-hover:text-white'
                      )}
                    />
                    {!collapsed && <span className={clsx("truncate transition-colors", pathname === href ? 'text-white' : 'text-gray-400 group-hover:text-white')}>{label}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
      
      <nav className="p-2 space-y-4 mt-auto">
  <button
    onClick={handleLogout}
    className={clsx(
      'relative flex items-center gap-3 px-4 py-2 rounded-lg w-full text-left transition',
      'hover:bg-neutral-800 focus:bg-neutral-800'
    )}
  >
    <div
      className={clsx(
        'relative z-10 flex items-center gap-3 w-full',
        collapsed && 'justify-center'
      )}
    >
      <FaSignOutAlt className="w-5 h-5 flex-shrink-0 text-gray-400 group-hover:text-white" />
      {!collapsed && (
        <span className="truncate text-gray-400 group-hover:text-white">
          Cerrar Sesión
        </span>
      )}
    </div>
  </button>
</nav>
    </aside>
  );
}
