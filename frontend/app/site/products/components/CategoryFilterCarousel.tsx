'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { FaChevronLeft, FaChevronRight, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface CategoryAPI {
  categoryId: number;
  categoryName: string;
}

interface CategoryFilterCarouselProps {
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilterCarousel({
  selectedCategory,
  onSelect,
}: CategoryFilterCarouselProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!res.ok) throw new Error('Error al obtener categorías');
        const data: CategoryAPI[] = await res.json();
        setCategories(['Todos', ...data.map(c => c.categoryName)]);
      } catch {
        setCategories(['Todos']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const checkScroll = () => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [categories]);

  const scrollBy = (offset: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleScroll = () => checkScroll();

  return (
    <div className="relative w-full max-w-6xl mx-auto py-4 flex items-center justify-center">

      <button
        onClick={() => scrollBy(-250)}
        disabled={!canScrollLeft}
        className={clsx(
          'z-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition hover:bg-white hover:scale-105',
          !canScrollLeft && 'opacity-50 cursor-not-allowed'
        )}
      >
        <FaChevronLeft size={18} />
      </button>

      <div className="flex-grow overflow-hidden relative mx-2">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto gap-4 px-2 py-2 scroll-smooth snap-x snap-mandatory touch-pan-x"
          style={{ paddingBottom: '20px', marginBottom: '-20px' }}
        >
          <div className="absolute left-0 top-0 h-full w-12 pointer-events-none bg-gradient-to-r from-white to-transparent z-10" />

          <div className="absolute right-0 top-0 h-full w-12 pointer-events-none bg-gradient-to-l from-white to-transparent z-10" />

          {isLoading
          ? Array(5).fill(0).map((_, i) => (
              <div key={i} className="w-24 h-10 bg-gray-200 animate-pulse rounded-full" />
            ))
          : categories.map((category, i) => (
              <motion.button
                key={i}
                onClick={() => onSelect(category === 'Todos' ? null : category)}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                animate={{
                  scale: selectedCategory === category || (selectedCategory === null && category === 'Todos') ? 1.1 : 1,
                }}
                className={clsx(
                  'flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap snap-center cursor-pointer',
                  selectedCategory === category || (selectedCategory === null && category === 'Todos')
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md'
                )}
                className={clsx('flex-shrink-0 px-6 py-3 rounded-full text-sm font-semibold whitespace-nowrap snap-center cursor-pointer', {
                  'bg-purple-600 text-white shadow-lg': selectedCategory === category || (selectedCategory === null && category === 'Todos'),
                  'bg-white text-gray-700 border border-gray-200 hover:shadow-md': !(selectedCategory === category || (selectedCategory === null && category === 'Todos')),
                })}
              >
                {category}
              </motion.button>
            ))}
        </div>
      </div>

      <button
        onClick={() => scrollBy(250)}
        disabled={!canScrollRight}
        className={clsx(
          'z-10 p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg transition hover:bg-white hover:scale-105',
          !canScrollRight && 'opacity-50 cursor-not-allowed'
        )}
      >
        <FaChevronRight size={18} />
      </button>
    </div>
  );
}
