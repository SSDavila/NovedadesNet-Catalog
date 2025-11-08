'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaList, FaTag, FaExclamationTriangle } from 'react-icons/fa';
import { Category } from '@/interfaces/index';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const SkeletonLoader = () => (
  <div className="space-y-2 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="h-9 bg-gray-200 rounded-lg"></div>
    ))}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function CategorySidebar({
  selectedCategory,
  onSelectCategory,
}: CategorySidebarProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar las categorías.');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <SkeletonLoader />;
    }

    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-3 rounded-lg">
          <FaExclamationTriangle className="mx-auto mb-2" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      );
    }

    return (
      <motion.ul className="space-y-1" variants={containerVariants}>
        <motion.li variants={itemVariants}>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full flex items-center text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              selectedCategory === null
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
            }`}
          >
            <FaList className="mr-3 h-4 w-4 flex-shrink-0" />
            Todas
          </button>
        </motion.li>
        {categories.map((category) => (
          <motion.li key={category.categoryId} variants={itemVariants}>
            <button
              onClick={() => onSelectCategory(category.categoryName)}
              className={`w-full flex items-center text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.categoryName
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
              }`}
            >
              <FaTag className="mr-3 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{category.categoryName}</span>
            </button>
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  return (
    <motion.aside
      className="w-full lg:w-64 flex-shrink-0 p-6 bg-white border border-gray-200/80 rounded-xl shadow-sm"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">
        Categorías
      </h2>
      {renderContent()}
    </motion.aside>
  );
}