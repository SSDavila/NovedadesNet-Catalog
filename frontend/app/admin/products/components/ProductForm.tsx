'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage, FaTimes } from 'react-icons/fa';

interface Categoria {
  categoryId: number;
  categoryName: string;
}

interface ProductFormProps {
  productData: {
    prodName: string;
    prodDesc: string;
    prodPrice: string;
    prodStock: string;
    prodCategory: string;
  };
  onProductDataChange: (data: ProductFormProps['productData']) => void;
  images: File[];
  onImagesChange: (images: File[]) => void;
  imagePreviews: string[];
  onImagePreviewsChange: (previews: string[]) => void;
}

export default function ProductForm({
  productData,
  onProductDataChange,
  images,
  onImagesChange,
  imagePreviews,
  onImagePreviewsChange,
}: ProductFormProps) {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías');
        const data: Categoria[] = await response.json();
        setCategorias(data);
        if (data.length > 0 && !productData.prodCategory) {
          handleChange('prodCategory', data[0].categoryName);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategorias();
  }, []);

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

  const handleChange = (field: keyof ProductFormProps['productData'], value: string) => {
    onProductDataChange({ ...productData, [field]: value });
  };

  return (
    <div className="space-y-4 overflow-y-auto pr-2 h-full">
      <div>
        <label htmlFor="prodName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
        <input type="text" id="prodName" value={productData.prodName} onChange={(e) => handleChange('prodName', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="prodPrice" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
          <input type="number" id="prodPrice" value={productData.prodPrice} onChange={(e) => handleChange('prodPrice', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-green-600 font-semibold" />
        </div>
        <div>
          <label htmlFor="prodStock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
          <input type="number" id="prodStock" value={productData.prodStock} onChange={(e) => handleChange('prodStock', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
      </div>

      <div>
        <label htmlFor="prodCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <select id="prodCategory" value={productData.prodCategory} onChange={(e) => handleChange('prodCategory', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition">
          {categorias.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="prodDesc" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea id="prodDesc" value={productData.prodDesc} onChange={(e) => handleChange('prodDesc', e.target.value)} rows={3} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
        <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'} border-dashed rounded-md transition-colors duration-200 cursor-pointer`}>
          <input {...getInputProps()} />
          <div className="space-y-1 text-center">
            <FaImage className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <p className="relative bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                <span>Añadir imágenes</span>
              </p>
              <p className="pl-1">o arrástralas aquí</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-600 mb-2">Nuevas imágenes:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={`${preview}-${index}`} className="relative group">
                  <img src={preview} alt={`Previsualización ${index + 1}`} className="h-24 w-24 object-cover rounded-md shadow-sm" />
                  <button type="button" onClick={() => handleRemoveNewImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none">
                    <FaTimes size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}