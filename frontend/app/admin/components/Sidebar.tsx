'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartBar, FaBox, FaShoppingCart, FaBars } from 'react-icons/fa';
import clsx from 'clsx';
import { useState } from 'react';

const links = [
  { href: '/admin', label: 'Dashboard', icon: FaChartBar },
  { href: '/admin/reports', label: 'Reportes', icon: FaChartBar },
  { href: '/admin/sales', label: 'Ventas', icon: FaShoppingCart },
];

const productLinks = [
  { href: '/admin/products', label: 'Productos', icon: FaBox },
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
      {/* Logo / Header */}
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
      <nav className="flex-1 p-2 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
              pathname === href
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-400 hover:bg-neutral-800 hover:text-white',
              collapsed && 'justify-center px-0'
            )}
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}

        {/* Products Section */}
        <div className={clsx('mt-6', collapsed && 'text-center')}>
          {!collapsed && (
            <p className="px-4 text-xs uppercase text-gray-500 mb-2 tracking-wide">
              Productos
            </p>
          )}
          {productLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200',
                pathname === href
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-neutral-800 hover:text-white',
                collapsed && 'justify-center px-0'
              )}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && <span>{label}</span>}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
}
