'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FaChartBar,
  FaBox,
  FaShoppingCart,
  FaChevronLeft,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import clsx from 'clsx';

const links = [
  { href: '/admin', label: 'Dashboard', icon: FaChartBar },
  { href: '/admin/reports', label: 'Reportes', icon: FaChartBar },
  { href: '/admin/sales', label: 'Ventas', icon: FaShoppingCart },
  { href: '/admin/products', label: 'Productos', icon: FaBox },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Persistencia de Dark Mode
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <motion.aside
      animate={{ width: collapsed ? '80px' : '240px' }}
      className={clsx(
        'h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-all'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
        {!collapsed && <span className="font-bold text-lg dark:text-white">Admin</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FaChevronLeft
            className={clsx(
              'transition-transform',
              collapsed ? 'rotate-180' : ''
            )}
          />
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
              pathname === href
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer - Dark mode toggle */}
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:opacity-80 transition"
        >
          {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          {!collapsed && <span>{darkMode ? 'Light' : 'Dark'} Mode</span>}
        </button>
      </div>
    </motion.aside>
  );
}
