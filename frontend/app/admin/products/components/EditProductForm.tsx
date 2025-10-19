'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage, FaTimes, FaSpinner, FaMagic, FaPlus } from 'react-icons/fa';
import { Product, ProductImage, Category } from '@/interfaces';

type ProductFormData = Pick<Product, 'productName' | 'productDescription' | 'categoryId'> & {
  productPrice: string;
  productStock: string;
};

interface EditProductFormProps {
  productData: ProductFormData;
  onProductDataChange: (data: ProductFormData) => void;
  newImages: File[];
  newImagePreviews: string[];
  existingImages: ProductImage[];
  isGenerating: boolean;
  onGenerateDescription: () => void;
  onRemoveExistingImage: (imageId: string) => void;
  onRemoveNewImage: (index: number) => void;
  onDropNewImages: (files: File[]) => void;
}

export default function EditProductForm({
  productData,
  onProductDataChange,
  newImages,
  newImagePreviews,
  existingImages,
  isGenerating,
  onGenerateDescription,
  onRemoveExistingImage,
  onRemoveNewImage,
  onDropNewImages,
}: EditProductFormProps) {
  const [categorias, setCategorias] = useState<Category[]>([]);

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
      onProductDataChange({ ...productData, categoryId: String(categorias[0].categoryId) });
    }
  }, [categorias, productData, onProductDataChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropNewImages,
    accept: { 'image/*': [] },
  });

  const handleChange = (
    field: keyof EditProductFormProps['productData'],
    value: string
  ) => {
    onProductDataChange({ ...productData, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="productName"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Nombre del Producto
        </label>
        <input
          type="text"
          id="productName"
          value={productData.productName}
          onChange={e => handleChange('productName', e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="productPrice"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Precio
          </label>
          <input
            type="number"
            id="productPrice"
            value={productData.productPrice}
            onChange={e => handleChange('productPrice', e.target.value)} 
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-black font-normal"
          />
        </div>

        <div>
          <label
            htmlFor="productStock"
            className="block text-sm font-semibold text-gray-800 mb-1"
          >
            Stock
          </label>
          <input
            type="number"
            id="productStock"
            value={productData.productStock}
            onChange={e => handleChange('productStock', e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="categoryId"
          className="block text-sm font-semibold text-gray-800 mb-1"
        >
          Categoría
        </label>
        <select
          id="categoryId"
          value={productData.categoryId}
          onChange={e => handleChange('categoryId', e.target.value)}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
        >
          {categorias.map(cat => (
            <option key={cat.categoryId} value={cat.categoryId}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label
            htmlFor="productDescription"
            className="block text-sm font-semibold text-gray-800"
          >
            Descripción
          </label>
          <button
            type="button"
            onClick={onGenerateDescription}
            disabled={isGenerating || !productData.productName}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}{' '}
            {isGenerating ? 'Generando...' : 'Generar con IA'}
          </button>
        </div>
        <textarea
          id="productDescription"
          value={productData.productDescription}
          onChange={e => handleChange('productDescription', e.target.value)}
          rows={8}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">
          Imágenes
        </label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {existingImages.map((image, index) => (
            <div key={`existing-${image.productImageUrl}-${index}`} className="relative group aspect-square">
              <img
                src={image.productImageUrl}
                alt={`Imagen existente ${image.productImageId}`}
                className="h-full w-full object-cover rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => onRemoveExistingImage(image.productImageId)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none z-10"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}

          {newImages.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="relative group aspect-square"
            >
              <img
                src={newImagePreviews[index]}
                alt={`Previsualización ${index + 1}`}
                className="h-full w-full object-cover rounded-md shadow-sm"
              />
              <button
                type="button"
                onClick={() => onRemoveNewImage(index)}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none z-10"
              >
                <FaTimes size={12} />
              </button>
            </div>
          ))}

          <div
            {...getRootProps()}
            className={`group relative aspect-square flex flex-col items-center justify-center gap-1 border-2 ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } border-dashed rounded-md transition-colors duration-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50`}
          >
            <input {...getInputProps()} />
            <FaPlus
              className="text-gray-400 group-hover:text-blue-500 transition-colors"
              size={24}
            />
            <span className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
              Añadir
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}