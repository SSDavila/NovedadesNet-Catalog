'use client';

import { useEffect, useState, FormEvent } from 'react';
import EditProductForm from './EditProductForm'; 
import { ProductImage } from './ProductCard';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import ProductPreview from './ProductPreview';
import Notification from '@/components/Notification';

interface InitialData {
  prodId: string;
  prodName: string;
  prodDescription: string;
  prodPrice: string;
  prodStock: string;
  prodCategory: string;
  images: ProductImage[];
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: InitialData;
  onProductUpdated: () => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  initialData,
  onProductUpdated,
}: EditProductModalProps) {
  const [productData, setProductData] = useState({
    prodName: '',
    prodDescription: '',
    prodPrice: '',
    prodStock: '',
    prodCategory: '',
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<number[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solo inicializa los estados cuando cambia el producto a editar
  useEffect(() => {
    if (initialData && isOpen) {
      setProductData({
        prodName: initialData.prodName || '',
        prodDescription: initialData.prodDescription || '',
        prodPrice: initialData.prodPrice || '',
        prodStock: initialData.prodStock || '',
        prodCategory: initialData.prodCategory || '',
      });
      setExistingImages(initialData.images || []);
      setImagesToDelete([]);
      setNewImages([]);
      setNewImagePreviews([]);
      setError(null);
      setIsGenerating(false);
      setIsSubmitting(false);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!productData.prodName) {
      alert('Por favor, ingresa un nombre de producto primero.');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productData.prodName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta de la IA');
      }
      const data = await response.json();
      setProductData(prev => ({ ...prev, prodDescription: data.description }));
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !productData.prodName ||
      !productData.prodPrice ||
      !productData.prodStock ||
      !productData.prodCategory
    ) {
      setError('Por favor, completa todos los campos requeridos.');
      return;
    }
    if (existingImages.length + newImages.length === 0) {
      setError('Debes subir al menos una imagen.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('prodName', productData.prodName.trim());
    formData.append('prodDescription', productData.prodDescription.trim());
    formData.append('prodPrice', productData.prodPrice.trim());
    formData.append('prodStock', productData.prodStock.trim());
    formData.append('prodCategory', productData.prodCategory.trim());
    formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    newImages.forEach((image) => {
      formData.append('prodImages', image);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${initialData.prodId}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
        throw new Error(message || 'Error al actualizar el producto');
      }

      onProductUpdated();
      onClose();
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition z-30 p-2 rounded-full bg-white/50 hover:bg-white"
        >
          <FaTimes />
        </button>

        <div className="p-6 pl-10 border-b border-gray-200 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Editar Producto</h2>
        </div>

        <div className="flex-grow grid md:grid-cols-2 gap-8 p-6 overflow-hidden">
          <div className="flex flex-col overflow-hidden p-4">
            <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                <EditProductForm
                  productData={productData}
                  onProductDataChange={setProductData}
                  newImages={newImages}
                  onNewImagesChange={setNewImages}
                  newImagePreviews={newImagePreviews}
                  onNewImagePreviewsChange={setNewImagePreviews}
                  existingImages={existingImages}
                  onExistingImagesChange={setExistingImages}
                  onImagesToDeleteChange={setImagesToDelete}
                  isGenerating={isGenerating}
                  onGenerateDescription={handleGenerateDescription}
                />
              </div>
              {error && (
                <div className="mt-4">
                  <Notification message={error} type="error" onClose={() => setError(null)} />
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-4">
                <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2">
                  {isSubmitting ? (<><FaSpinner className="animate-spin" /> Guardando...</>) : ('Guardar Cambios')}
                </button>
              </div>
            </form>
          </div>
          <div className="hidden md:flex flex-col overflow-hidden h-full">
            <ProductPreview 
              nombre={productData.prodName} 
              precio={productData.prodPrice} 
              descripcion={productData.prodDescription} 
              stock={productData.prodStock} 
              categoria={productData.prodCategory} 
              imagenes={[...existingImages.map(img => img.prodImageUrl), ...newImagePreviews]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}