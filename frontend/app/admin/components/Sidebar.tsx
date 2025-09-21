'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaBars,
  FaTags,
  FaTachometerAlt,
  FaFileInvoiceDollar,
  FaFileAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useState } from 'react';

const mainLinks = [
  { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { href: '/admin/reports', label: 'Reportes', icon: FaChartBar },
  { href: '/admin/sales', label: 'Ventas', icon: FaShoppingCart },
];

const productLinks = [
  { href: '/admin/products', label: 'Productos', icon: FaBox },
  { href: '/admin/categories', label: 'Categorías', icon: FaTags },
];

const billingLinks = [
  { href: '/admin/billing', label: 'Facturación', icon: FaFileInvoiceDollar },
  { href: '/admin/salesnotes', label: 'Notas de Venta', icon: FaFileAlt },
];

const sections = [
  { title: 'Principal', links: mainLinks },
  { title: 'Productos', links: productLinks },
  { title: 'Facturación', links: billingLinks },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

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

      {/* Links */}
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
    </aside>
  );
}
