'use client';

import { useState } from 'react';

interface FiltersProps {
  onFilterChange: (filters: { stock?: boolean; minRating?: number }) => void;
}

export default function Filters({ onFilterChange }: FiltersProps) {
  const [stockOnly, setStockOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const handleStockChange = () => {
    const newStock = !stockOnly;
    setStockOnly(newStock);
    onFilterChange({ stock: newStock, minRating });
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    onFilterChange({ stock: stockOnly, minRating: rating });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={stockOnly} onChange={handleStockChange} />
        Solo productos disponibles
      </label>

      <div className="flex items-center gap-2">
        <span>Rating mínimo:</span>
        {[0, 1, 2, 3, 4, 5].map((r) => (
          <button
            key={r}
            onClick={() => handleRatingChange(r)}
            className={`px-2 py-1 rounded ${
              minRating === r ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {r}⭐
          </button>
        ))}
      </div>
    </div>
  );
}
