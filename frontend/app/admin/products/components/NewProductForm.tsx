'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes, FaSpinner, FaMagic, FaPlus } from 'react-icons/fa';
import { Product, Category } from '@/interfaces';

type NewProductFormData = Pick<Product, 'productName' | 'productDescription' | 'categoryId'> & {
  productPrice: string;
  productStock: string;
  productPreviousPrice: string;
};

interface NewProductFormProps {
  productData: NewProductFormData;
  onProductDataChange: (data: NewProductFormData) => void;
  images: File[];
  onImagesChange: (images: File[]) => void;
  imagePreviews: string[];
  onImagePreviewsChange: (previews: string[]) => void;
  isGenerating: boolean;
  onGenerateDescription: () => void;
}

export default function NewProductForm({
  productData,
  onProductDataChange,
  images,
  onImagesChange,
  imagePreviews,
  onImagePreviewsChange,
  isGenerating,
  onGenerateDescription,
}: NewProductFormProps) {
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [isPreviousPriceEnabled, setIsPreviousPriceEnabled] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías');
        const data: Category[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategorias();
  }, []);

  useEffect(() => {
    if (categorias.length > 0 && !productData.categoryId) {
      onProductDataChange({ ...productData, categoryId: categorias[0].categoryId });
    }
  }, [categorias, productData, onProductDataChange]);

  useEffect(() => {
    if (!isPreviousPriceEnabled) {
      onProductDataChange({ ...productData, productPreviousPrice: '0' });
    }
  }, [isPreviousPriceEnabled]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(file => URL.revokeObjectURL(file));
    };
  }, [imagePreviews]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFilesWithPreview = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    onImagesChange([...images, ...newFilesWithPreview]);
    onImagePreviewsChange([...imagePreviews, ...newFilesWithPreview.map(f => f.preview)]);
  }, [images, imagePreviews, onImagesChange, onImagePreviewsChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleRemoveNewImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
    onImagePreviewsChange(imagePreviews.filter((_, i) => i !== index));
  };

  const handleChange = (field: keyof NewProductFormData, value: string) => {
    onProductDataChange({ ...productData, [field]: value });
  };

  return (
    <div className="space-y-4 overflow-y-auto pr-2 h-full">
      <div>
        <label htmlFor="productName" className="block text-sm font-semibold text-gray-800 mb-1">Nombre del Producto</label>
        <input type="text" id="productName" value={productData.productName} onChange={(e) => handleChange('productName', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-gray-900" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="productPrice" className="block text-sm font-semibold text-gray-800 mb-1">Precio</label>
          <input type="number" id="productPrice" value={productData.productPrice} onChange={(e) => handleChange('productPrice', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-black font-semibold" />
        </div>
        <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
                <label htmlFor="productPreviousPrice" className="block text-sm font-semibold text-gray-800">Precio Anterior (Oferta)</label>
                <div className="flex items-center">
                    <input type="checkbox" id="enablePreviousPrice" checked={isPreviousPriceEnabled} onChange={(e) => setIsPreviousPriceEnabled(e.target.checked)} className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <label htmlFor="enablePreviousPrice" className="ml-2 text-sm text-gray-600">Habilitar</label>
                </div>
            </div>
            <input 
              type="number" 
              id="productPreviousPrice" 
              value={productData.productPreviousPrice} 
              onChange={(e) => handleChange('productPreviousPrice', e.target.value)} 
              disabled={!isPreviousPriceEnabled} 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed" />
        </div>
        <div>
          <label htmlFor="productStock" className="block text-sm font-semibold text-gray-800 mb-1">Stock</label>
          <input type="number" id="productStock" value={productData.productStock} onChange={(e) => handleChange('productStock', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-800 mb-1">Categoría</label>
        <select id="categoryId" value={productData.categoryId} onChange={(e) => handleChange('categoryId', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition">
          {categorias.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="productDescription" className="block text-sm font-semibold text-gray-800">Descripción</label>
          <button
            type="button"
            onClick={onGenerateDescription}
            disabled={isGenerating || !productData.productName}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {isGenerating ? 'Generando...' : 'Generar con IA'}
          </button>
        </div>
        <textarea id="productDescription" value={productData.productDescription} onChange={(e) => handleChange('productDescription', e.target.value)} rows={8} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">Imágenes</label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {images.map((file, index) => (
            <div key={`${file.name}-${file.lastModified}-${index}`} className="relative group aspect-square">
              <img src={imagePreviews[index]} alt={`Previsualización ${index + 1}`} className="h-full w-full object-cover rounded-md shadow-sm" />
              <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none z-10">
                <FaTimes size={12} />
              </button>
            </div>
          ))}
          <div {...getRootProps()} className={`group relative aspect-square flex flex-col items-center justify-center gap-1 border-2 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-md transition-colors duration-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50`}>
            <input {...getInputProps()} />
            <FaPlus className="text-gray-400 group-hover:text-blue-500 transition-colors" size={24} />
            <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
              Añadir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}