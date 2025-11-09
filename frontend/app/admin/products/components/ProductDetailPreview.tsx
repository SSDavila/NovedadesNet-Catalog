'use client';

import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';

interface ProductDetailPreviewProps {
  name: string;
  category: string;
  price: number;
  offerPrice: number;
  stock: number;
  description: string;
  imagePreviews: string[];
}

export const ProductDetailPreview = ({
  name,
  category,
  price,
  offerPrice,
  stock,
  description,
  imagePreviews,
}: ProductDetailPreviewProps) => {
  const [selectedImage, setSelectedImage] = useState<string>(imagePreviews[0] || '/placeholder.svg');

  useEffect(() => {
    if (!imagePreviews.includes(selectedImage) || (selectedImage === '/placeholder.svg' && imagePreviews.length > 0)) {
      setSelectedImage(imagePreviews[0] || '/placeholder.svg');
    }
  }, [imagePreviews, selectedImage]);

  const formatPrice = (price: number) => {
    if (isNaN(price) || price === null) return '$0.00';
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockColors = (currentStock: number) => {
    const stockNumber = isNaN(currentStock) ? 0 : currentStock;
    if (stockNumber > 5) return { dot: 'bg-green-500', container: 'bg-green-100', text: 'text-green-800' };
    if (stockNumber >= 3) return { dot: 'bg-yellow-500', container: 'bg-yellow-100', text: 'text-yellow-800' };
    if (stockNumber >= 1) return { dot: 'bg-orange-500', container: 'bg-orange-100', text: 'text-orange-800' };
    return { dot: 'bg-red-500', container: 'bg-red-100', text: 'text-red-800' };
  };

  const stockColors = getStockColors(stock);
  const hasOffer = offerPrice > 0 && offerPrice < price;

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg overflow-hidden h-full">

      <div className="w-full md:w-1/2 p-4">
        <div className="aspect-square w-full rounded-xl overflow-hidden mb-4 bg-gray-200">
          <img src={selectedImage} alt={name || 'Imagen principal'} className="w-full h-full object-cover" />
        </div>
        <div className="grid grid-cols-5 gap-2">
          {imagePreviews.length > 0 ? (
            imagePreviews.map((img, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === img ? 'border-purple-600' : 'border-transparent'}`}
                onClick={() => setSelectedImage(img)}
              >
                <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
              </div>
            ))
          ) : (
            Array.from({ length: 5 }).map((_, i) => <div key={i} className="aspect-square rounded-md bg-gray-200" />)
          )}
        </div>
      </div>

      <div className="w-full md:w-1/2 p-6 flex flex-col">
        <p className="text-sm font-bold text-purple-600 uppercase tracking-wider min-h-[20px]">
          {category || 'Categoría'}
        </p>
        <h2 className="text-3xl font-bold text-gray-900 mt-2 min-h-[40px]">{name || 'Nombre del Producto'}</h2>
        <div className="flex items-baseline gap-3 mt-4 mb-4">
          {hasOffer ? (
            <>
              <p className="text-3xl font-extrabold text-gray-900">{formatPrice(offerPrice)}</p>
              <p className="text-xl text-gray-500 line-through">{formatPrice(price)}</p>
            </>
          ) : (
            <p className="text-3xl font-extrabold text-gray-800">{formatPrice(price)}</p>
          )}
        </div>
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${stockColors.container} ${stockColors.text}`}>
            <div className={`w-2.5 h-2.5 rounded-full mr-2 ${stockColors.dot}`}></div>
            {stock > 0 ? `${stock} unidades en stock` : 'Agotado'}
          </span>
        </div>
        <div className="text-gray-600 text-sm leading-relaxed flex-grow prose prose-sm max-w-none">
          <p className="whitespace-pre-wrap">{description || 'Aquí aparecerá la descripción del producto...'}</p>
        </div>
        <button
          type="button"
          className="mt-6 w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-lg"
        >
          <FaWhatsapp size={30} className="mr-3" />
          Pedir por WhatsApp
        </button>
      </div>
    </div>
  );
};