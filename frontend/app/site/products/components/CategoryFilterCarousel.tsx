'use client';
import Marquee from 'react-fast-marquee';

interface CategoryFilterCarouselProps {
  categories: string[];
  selectedCategory: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilterCarousel({
  categories,
  selectedCategory,
  onSelect,
}: CategoryFilterCarouselProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      <Marquee
        pauseOnHover={true}
        speed={40} // Puedes ajustar la velocidad aquí
        gradient={true} // La librería añade un degradado, es más eficiente
        gradientColor="rgb(249 250 251)" // Color de fondo de la página (bg-gray-50)
        gradientWidth={100}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category === selectedCategory ? null : category)}
            className={`flex-shrink-0 whitespace-nowrap mx-4 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-colors duration-300 ${
              selectedCategory === category
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </Marquee>
    </div>
  );
}
