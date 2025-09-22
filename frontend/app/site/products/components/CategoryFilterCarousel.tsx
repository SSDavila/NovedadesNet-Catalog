'use client';

import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import Marquee from 'react-fast-marquee';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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
  const [isPaused, setIsPaused] = useState(false);
  const marqueeRef = useRef<any>(null); // Ref para controlar el Marquee
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        if (!response.ok) throw new Error('Error al obtener las categorías');
        const data: CategoryAPI[] = await response.json();
        setCategories(['Todos', ...data.map((c) => c.categoryName)]);
      } catch (err) {
        console.error(err);
        setCategories(['Todos']);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleSelect = (category: string) => {
    if (selectedCategory === category) {
      onSelect(null);
    } else {
      onSelect(category === 'Todos' ? null : category);
    }
  };

  const handleArrowClick = (direction: 'left' | 'right') => {
    if (marqueeRef.current) {
      // Pausamos la animación para el control manual
      setIsPaused(true);

      // Cambiamos la dirección y damos un "empujón"
      const marqueeInstance = marqueeRef.current.getMarquee();
      marqueeInstance.changeDirection(direction);
      marqueeInstance.applyTransition();

      // Reanudamos la animación después de un momento
      setTimeout(() => {
        setIsPaused(false);
        marqueeInstance.changeDirection('left'); // Volvemos a la dirección original
      }, 500);
    }
  };

  const minButtonWidth = 125;
  const containerWidth = Math.min(categories.length * minButtonWidth, 1200);

  return (
    <div className="relative w-full py-3 flex justify-center">
      {isLoading ? (
        <div className="flex justify-center">
          <div className="bg-gray-200 animate-pulse h-10 w-full max-w-lg rounded-full" />
        </div>
      ) : (
        <div className="relative flex items-center" style={{ width: containerWidth }}>
          {/* Flecha izquierda */}
          <button
            onClick={() => handleArrowClick('right')} // Invertido para empujar el contenido
            className="absolute left-0 z-10 p-2 bg-gray-50 rounded-full shadow hover:bg-gray-100 transition"
          >
            <FaChevronLeft />
          </button>

          {/* Contenedor del carrusel con difuminado elegante */}
          <div
            ref={containerRef}
            className="overflow-hidden w-full relative px-10 before:absolute before:top-0 before:left-0 before:h-full before:w-16 before:bg-gradient-to-r before:from-gray-50 before:to-transparent after:absolute after:top-0 after:right-0 after:h-full after:w-16 after:bg-gradient-to-l after:from-gray-50 after:to-transparent"
          > 
            <Marquee
              ref={marqueeRef}
              gradient={false}
              speed={40}
              pauseOnHover
              play={!isPaused}
              direction="left"
              className="flex"
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSelect(category)}
                  className={clsx(
                    'mx-3 px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200',
                    selectedCategory === category ||
                      (selectedCategory === null && category === 'Todos')
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  )}
                >
                  {category}
                </button>
              ))}
            </Marquee>
          </div>

          {/* Flecha derecha */}
          <button
            onClick={() => handleArrowClick('left')} // Invertido para empujar el contenido
            className="absolute right-0 z-10 p-2 bg-gray-50 rounded-full shadow hover:bg-gray-100 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
