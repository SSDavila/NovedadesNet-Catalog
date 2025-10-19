'use client';

import { useEffect, useState, FormEvent, useCallback } from 'react';
import EditProductForm from './EditProductForm'; 
import { FaTimes, FaSpinner } from 'react-icons/fa';
import ProductPreview from './ProductPreview';
import { ProductImage } from '@/interfaces';
import { useNotification } from '@/components/Notifications/NotificationContext';

interface InitialData {
  productId: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productStock: string;
  categoryId: string;
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
    productName: '',
    productDescription: '',
    productPrice: '',
    productStock: '',
    categoryId: '',
  });

  const [existingImages, setExistingImages] = useState<ProductImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotification();

  useEffect(() => {
    if (initialData && isOpen) {
      setProductData({
        productName: initialData.productName || '',
        productDescription: initialData.productDescription || '',
        productPrice: initialData.productPrice || '',
        productStock: initialData.productStock || '',
        categoryId: initialData.categoryId || '',
      });
      setExistingImages(initialData.images || []);
      setImagesToDelete([]);
      setNewImages([]);
      setNewImagePreviews([]);
      setIsGenerating(false);
      setIsSubmitting(false);
    }
  }, [initialData, isOpen]);

  const handleRemoveExistingImage = useCallback((imageId: string) => {
    const imageToRemove = existingImages.find(img => img.productImageId === imageId);
    if (!imageToRemove) return;

    // Guardamos el public_id para enviarlo al backend y borrarlo de Cloudinary
    setImagesToDelete(current => [...current, imageToRemove.productImagePublicId]);
    setExistingImages(current => current.filter(img => img.productImageId !== imageId));
  }, [existingImages, imagesToDelete]);

  const handleRemoveNewImage = useCallback((indexToRemove: number) => {
    const imageUrlToRemove = newImagePreviews[indexToRemove];
    if (imageUrlToRemove) {
      URL.revokeObjectURL(imageUrlToRemove);
    }
    setNewImages(prev => prev.filter((_, i) => i !== indexToRemove));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== indexToRemove));
  }, [newImagePreviews]);

  const handleDropNewImages = useCallback((acceptedFiles: File[]) => {
    const newFilesWithPreview = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setNewImages(prev => [...prev, ...newFilesWithPreview]);
    setNewImagePreviews(prev => [
      ...prev,
      ...newFilesWithPreview.map(f => f.preview),
    ]);
  }, []);

  const handleProductDataChange = useCallback((data: typeof productData) => {
    setProductData(data);
  }, []);

  if (!isOpen) return null;

  const handleGenerateDescription = async () => {
    if (!productData.productName) {
      addNotification('Por favor, ingresa un nombre de producto primero.', 'warning');
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-description`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: productData.productName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta de la IA');
      }
      const data = await response.json();
      setProductData(prev => ({ ...prev, productDescription: data.description }));
    } catch (err: any) {
      addNotification(`Error: ${err.message}`, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !productData.productName ||
      !productData.productPrice ||
      !productData.productStock ||
      !productData.categoryId
    ) {
      addNotification('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }
    if (existingImages.length + newImages.length === 0) {
      addNotification('Debes subir al menos una imagen.', 'warning');
      return;
    }
    setIsSubmitting(true);

    try {
      const productUpdateData = {
        productName: productData.productName.trim(),
        productDescription: productData.productDescription.trim(),
        productPrice: productData.productPrice.trim(),
        productStock: productData.productStock.trim(),
        categoryId: productData.categoryId.trim(),
        imagesToDelete: imagesToDelete,
      };

      const productUpdateResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${initialData.productId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productUpdateData),
        }
      );

      if (!productUpdateResponse.ok) {
        const errorData = await productUpdateResponse.json();
        const message = Array.isArray(errorData.message)
          ? errorData.message.join(', ')
          : errorData.message;
        throw new Error(message || 'Error al actualizar los datos del producto.');
      }

      if (newImages.length > 0) {
        const imageFormData = new FormData();
        newImages.forEach(image => {
          imageFormData.append('images', image);
        });

        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${initialData.productId}/upload-images`,
          {
            method: 'POST',
            body: imageFormData,
          }
        );

        if (!imageResponse.ok) {
          throw new Error('Error al subir las nuevas imágenes.');
        }
      }

      onProductUpdated();
      onClose();
    } catch (err: any) {
      addNotification(err.message, 'error');
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
                  onProductDataChange={handleProductDataChange}
                  newImages={newImages}
                  newImagePreviews={newImagePreviews}
                  existingImages={existingImages}
                  onRemoveExistingImage={handleRemoveExistingImage}
                  onRemoveNewImage={handleRemoveNewImage}
                  onDropNewImages={handleDropNewImages}
                  isGenerating={isGenerating}
                  onGenerateDescription={handleGenerateDescription}
                />
              </div>
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
              nombre={productData.productName} 
              precio={productData.productPrice} 
              descripcion={productData.productDescription} 
              stock={productData.productStock} 
              categoria={productData.categoryId} // Esto debería ser el nombre, pero lo ajustaremos si es necesario
              imagenes={[...existingImages.map(img => img.productImageUrl), ...newImagePreviews]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}