'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaList, FaExclamationTriangle } from 'react-icons/fa';
import { Category } from '@/interfaces/index';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

interface CategorySidebarProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

const SkeletonLoader = () => (
  <div className="space-y-4 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-100 rounded-lg"></div>
        <div className="h-4 bg-gray-100 rounded-md flex-grow"></div>
      </div>
    ))}
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { x: -10, opacity: 0 },
  visible: { x: 0, opacity: 1 },
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
          throw new Error('Error al cargar categorías');
        }
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (err: any) {
        setError(err.message || 'Error inesperado');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const renderContent = () => {
    if (isLoading) return <SkeletonLoader />;

    if (error) {
      return (
        <div className="text-center p-6 bg-red-50/50 rounded-2xl border border-red-100/50">
          <FaExclamationTriangle className="mx-auto mb-3 text-red-400" size={24} />
          <p className="text-xs font-bold text-red-600 uppercase tracking-widest leading-normal">{error}</p>
        </div>
      );
    }

    return (
      <motion.div className="space-y-1.5" variants={containerVariants}>
        <motion.button
          variants={itemVariants}
          onClick={() => onSelectCategory(null)}
          className={clsx(
            "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group",
            selectedCategory === null
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
              : "text-gray-500 hover:bg-white hover:text-purple-600 hover:shadow-sm"
          )}
        >
          <div className={clsx(
            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
            selectedCategory === null ? "bg-white/20" : "bg-gray-50 group-hover:bg-purple-50"
          )}>
            <FaList size={14} />
          </div>
          <span className="tracking-tight">Todas</span>
          {selectedCategory === null && (
            <motion.div layoutId="activeCat" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.categoryId}
            variants={itemVariants}
            onClick={() => onSelectCategory(category.categoryName)}
            className={clsx(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative group",
              selectedCategory === category.categoryName
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/20"
                : "text-gray-500 hover:bg-white hover:text-purple-600 hover:shadow-sm"
            )}
          >
            <div className={clsx(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
              selectedCategory === category.categoryName ? "bg-white/20" : "bg-gray-50 group-hover:bg-purple-50"
            )}>
              <Icon icon={category.categoryIcon || 'ph:tag-bold'} width="18" />
            </div>
            <span className="tracking-tight truncate">{category.categoryName}</span>
            {selectedCategory === category.categoryName && (
              <motion.div layoutId="activeCat" className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />
            )}
          </motion.button>
        ))}
      </motion.div>
    );
  };

  return (
    <motion.div
      className="w-full"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="mb-4 pl-4">
        <h2 className="text-[9px] font-black text-purple-600 uppercase tracking-[0.2em]">
          Explorar
        </h2>
        <h3 className="text-xl font-black text-gray-900 tracking-tighter mt-1">
          Categorías
        </h3>
      </div>
      <div className="bg-gray-50/50 p-2 rounded-[2rem] border border-gray-100">
        {renderContent()}
      </div>
    </motion.div>
  );
}
