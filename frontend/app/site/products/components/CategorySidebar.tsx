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
  <div className="flex lg:flex-col gap-2 animate-pulse overflow-hidden py-1">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-full lg:rounded-xl bg-gray-100/80 shrink-0 w-24 lg:w-full h-8 lg:h-11">
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
      <motion.div
        className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 lg:space-y-1.5 scrollbar-none py-1 px-1 lg:px-0"
        variants={containerVariants}
      >
        <motion.button
          variants={itemVariants}
          onClick={() => onSelectCategory(null)}
          className={clsx(
            "shrink-0 flex items-center gap-2 lg:gap-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-full lg:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative group whitespace-nowrap",
            selectedCategory === null
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "text-gray-600 bg-white/80 lg:bg-transparent hover:bg-white hover:text-purple-600 border border-gray-200/60 lg:border-none hover:shadow-sm"
          )}
        >
          <div className={clsx(
            "w-6 h-6 lg:w-8 lg:h-8 rounded-full lg:rounded-lg flex items-center justify-center transition-colors",
            selectedCategory === null ? "bg-white/20" : "bg-gray-100 group-hover:bg-purple-50"
          )}>
            <FaList size={12} className="lg:w-3.5 lg:h-3.5" />
          </div>
          <span className="tracking-tight">Todas</span>
          {selectedCategory === null && (
            <motion.div layoutId="activeCat" className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />
          )}
        </motion.button>

        {categories.map((category) => (
          <motion.button
            key={category.categoryId}
            variants={itemVariants}
            onClick={() => onSelectCategory(category.categoryName)}
            className={clsx(
              "shrink-0 flex items-center gap-2 lg:gap-3 px-3.5 py-2 lg:px-4 lg:py-3 rounded-full lg:rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 relative group whitespace-nowrap",
              selectedCategory === category.categoryName
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
                : "text-gray-600 bg-white/80 lg:bg-transparent hover:bg-white hover:text-purple-600 border border-gray-200/60 lg:border-none hover:shadow-sm"
            )}
          >
            <div className={clsx(
              "w-6 h-6 lg:w-8 lg:h-8 rounded-full lg:rounded-lg flex items-center justify-center transition-colors",
              selectedCategory === category.categoryName ? "bg-white/20" : "bg-gray-100 group-hover:bg-purple-50"
            )}>
              <Icon icon={category.categoryIcon || 'ph:tag-bold'} width="16" />
            </div>
            <span className="tracking-tight truncate">{category.categoryName}</span>
            {selectedCategory === category.categoryName && (
              <motion.div layoutId="activeCat" className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white" />
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
      <div className="mb-2 lg:mb-4 px-2 lg:pl-4 flex items-center justify-between lg:block">
        <h2 className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
          Explorar
        </h2>
        <h3 className="text-sm lg:text-xl font-black text-gray-900 tracking-tight lg:tracking-tighter lg:mt-1">
          Categorías
        </h3>
      </div>
      <div className="bg-transparent lg:bg-gray-50/50 p-0 lg:p-2 rounded-none lg:rounded-[2rem] border-0 lg:border lg:border-gray-100">
        {renderContent()}
      </div>
    </motion.div>
  );
}
