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
  const [selectedImage, setSelectedImage] = useState<string>('');
  
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setSelectedImage(product.images[0].productImageUrl);
    } else if (product) {
      setSelectedImage('https://via.placeholder.com/600');
    }
  }, [product]);

  const handleWhatsAppClick = () => {
    const phoneNumber = '593963988846'; 
    const message = `¡Hola! Estoy interesado/a en el producto: ${product?.productName}`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (!product) {
    return null;
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex justify-center items-center p-4"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={backdropVariants}
          onClick={onClose}
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
                    onClick={() => setSelectedImage(image.productImageUrl)}
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
              <p className="text-3xl font-extrabold text-gray-800 mt-4 mb-4">
                {formatPrice(product.productPrice)}
              </p>
              <div className="text-gray-600 text-sm leading-relaxed flex-grow">
                <p>{product.productDescription}</p>
              </div>
              <button
                onClick={handleWhatsAppClick}
                className="mt-6 w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-lg"
              >
                <FaWhatsapp className="mr-2" />
                Pedir por WhatsApp
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}