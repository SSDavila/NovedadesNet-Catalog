'use client';

import { useState, FormEvent, useEffect } from 'react';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { Category } from '@/interfaces';
import ProductForm from './ProductForm';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { API_BASE_URL } from '@/lib/constants';
import { ProductDetailPreview } from './ProductDetailPreview';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  createProductMutation: any;
}

const INITIAL_STATE = {
  productName: '',
  productDescription: '',
  productPrice: '',
  productOfferPrice: '0',
  productStock: '',
  categoryId: '',
};

export default function NewProductModal({ isOpen, onClose, createProductMutation }: NewProductModalProps) {
  const [productData, setProductData] = useState(INITIAL_STATE);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías.');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();

    // Este efecto se encarga de limpiar las URLs de las imágenes para evitar fugas de memoria.
    // Se ejecutará solo cuando el componente se desmonte (cuando el modal se cierre).
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, []); // Se deja el array de dependencias vacío intencionadamente.

  const handleClose = () => {
    setProductData(INITIAL_STATE);
    setImages([]);
    setImagePreviews([]);
    setIsGenerating(false);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  const handleGenerateDescription = async () => {
    if (!productData.productName) {
      addNotification('Por favor, ingresa un nombre de producto primero.', 'warning');
      return;
    }
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/ai/generate-description`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productName: productData.productName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta de la IA');
      }
      const data = await response.json();
      setProductData(prev => ({ ...prev, productDescription: data.description }));
    } catch (err: any) {
      addNotification(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productData.productName || !productData.productPrice || !productData.productStock || !productData.categoryId) {
        addNotification('Por favor, completa todos los campos requeridos.', 'warning');
        return;
    }
    if (images.length === 0) {
      addNotification('Debes subir al menos una imagen.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('productName', productData.productName.trim());
    formData.append('productDescription', productData.productDescription.trim());
    formData.append('productPrice', productData.productPrice);
    formData.append('productOfferPrice', productData.productOfferPrice || '0');
    formData.append('productStock', productData.productStock);
    formData.append('categoryId', productData.categoryId);
    images.forEach((image) => {
      formData.append('images', image);
    });

    createProductMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col relative">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
          <div className="grid lg:grid-cols-7 flex-grow overflow-y-auto">

            <div className="lg:col-span-3 overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
              <ProductForm
                productData={productData}
                onProductDataChange={setProductData}
                images={images}
                onImagesChange={setImages}
                imagePreviews={imagePreviews}
                onImagePreviewsChange={setImagePreviews}
                isGenerating={isGenerating}
                onGenerateDescription={handleGenerateDescription}
                categories={categories}
              />
            </div>

            <div className="hidden lg:col-span-4 lg:flex flex-col bg-gray-100 p-5 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
              <div className="w-full">
                <ProductDetailPreview
                  name={productData.productName}
                  category={categories.find(c => c.categoryId === productData.categoryId)?.categoryName || ''}
                  price={parseFloat(productData.productPrice)}
                  offerPrice={parseFloat(productData.productOfferPrice)}
                  stock={parseInt(productData.productStock, 10)}
                  description={productData.productDescription}
                  imagePreviews={imagePreviews}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
            <button type="button" onClick={handleClose} disabled={createProductMutation.isPending} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={createProductMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2">
              {createProductMutation.isPending ? (<><FaSpinner className="animate-spin" /> Guardando...</>) : ('Guardar Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}