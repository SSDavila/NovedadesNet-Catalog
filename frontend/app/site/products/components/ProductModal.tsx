'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, ProductImage } from '@/interfaces/index';
import { FaTimes, FaWhatsapp } from 'react-icons/fa';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: {
    y: -50,
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { delay: 0.1, duration: 0.3 },
  },
  exit: {
    y: 50,
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.2 },
  },
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [userSelectedImage, setUserSelectedImage] = useState<string | null>(null);

  const getStockColors = (stock: number) => {
    if (stock > 5) {
      return { dot: 'bg-green-500', container: 'bg-green-100', text: 'text-green-800' };
    }
    if (stock >= 3) {
      return { dot: 'bg-yellow-500', container: 'bg-yellow-100', text: 'text-yellow-800' };
    }
    if (stock >= 1) {
      return { dot: 'bg-orange-500', container: 'bg-orange-100', text: 'text-orange-800' };
    }
    return { dot: 'bg-red-500', container: 'bg-red-100', text: 'text-red-800' };
  };

  const primaryImageUrl = product?.images?.[0]?.productImageUrl || 'https://via.placeholder.com/600';
  const selectedImage = userSelectedImage || primaryImageUrl;
  
  const handleWhatsAppClick = () => {
    const phoneNumber = '593963988846'; 
    const message = `¡Hola! Estoy interesado/a en el producto: ${product?.productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!product) {
    return null;
  }

  const stockColors = getStockColors(product.productStock);

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row"
            variants={modalVariants}
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full md:w-1/2 p-4">
              <div className="aspect-square w-full rounded-xl overflow-hidden mb-4">
                <img src={selectedImage} alt={product.productName} className="w-full h-full object-cover" />
              </div>
              <div className="grid grid-cols-5 gap-2">
                {product.images?.map((image) => (
                  <div
                    key={image.productImageId}
                    className={`aspect-square rounded-md overflow-hidden cursor-pointer border-2 ${selectedImage === image.productImageUrl ? 'border-purple-600' : 'border-transparent'}`}
                    onClick={() => setUserSelectedImage(image.productImageUrl)}
                  >
                    <img src={image.productImageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full md:w-1/2 p-6 flex flex-col">
              <div className="flex justify-between items-start">
                <p className="text-sm font-bold text-purple-600 uppercase tracking-wider">
                  {product.category?.categoryName}
                </p>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
                  <FaTimes size={24} />
                </button>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">{product.productName}</h2>
              <div className="flex items-baseline gap-3 mt-4 mb-4">
                {product.productOfferPrice && product.productOfferPrice > 0 && product.productOfferPrice < product.productPrice ? (
                  <>
                    <p className="text-3xl font-extrabold text-gray-900">
                      {formatPrice(product.productOfferPrice)}
                    </p>
                    <p className="text-xl text-gray-500 line-through">
                      {formatPrice(product.productPrice)}
                    </p>
                  </>
                ) : (
                  <p className="text-3xl font-extrabold text-gray-800">{formatPrice(product.productPrice)}</p>
                )}
              </div>
              <div className="mb-4">
                <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${stockColors.container} ${stockColors.text}`}>
                  <div className={`w-2.5 h-2.5 rounded-full mr-2 ${stockColors.dot}`}></div>
                  {product.productStock > 0 ? `${product.productStock} unidades en stock` : 'Agotado'}
                </span>
              </div>
              <div className="text-gray-600 text-sm leading-relaxed flex-grow prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{product.productDescription}</p>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="mt-6 w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-lg"
              >
                <FaWhatsapp size={30} className="mr-3" />
                Pedir por WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}