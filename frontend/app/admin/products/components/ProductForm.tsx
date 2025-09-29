'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage, FaTimes, FaSpinner, FaMagic, FaPlus } from 'react-icons/fa';

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
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías');
        const data: Categoria[] = await response.json();
        setCategorias(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Se ejecuta solo una vez al montar

  useEffect(() => {
    if (categorias.length > 0 && !productData.prodCategory) {
      onProductDataChange({ ...productData, prodCategory: categorias[0].categoryName });
    }
  }, [categorias, productData, onProductDataChange]);

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
      handleChange('prodDesc', data.description);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'No se pudo generar la descripción.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 overflow-y-auto pr-2 h-full">
      <div>
        <label htmlFor="prodName" className="block text-sm font-semibold text-gray-800 mb-1">Nombre del Producto</label>
        <input type="text" id="prodName" value={productData.prodName} onChange={(e) => handleChange('prodName', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-gray-900" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="prodPrice" className="block text-sm font-semibold text-gray-800 mb-1">Precio</label>
          <input type="number" id="prodPrice" value={productData.prodPrice} onChange={(e) => handleChange('prodPrice', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-black font-semibold" />
        </div>
        <div>
          <label htmlFor="prodStock" className="block text-sm font-semibold text-gray-800 mb-1">Stock</label>
          <input type="number" id="prodStock" value={productData.prodStock} onChange={(e) => handleChange('prodStock', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
        </div>
      </div>

      <div>
        <label htmlFor="prodCategory" className="block text-sm font-semibold text-gray-800 mb-1">Categoría</label>
        <select id="prodCategory" value={productData.prodCategory} onChange={(e) => handleChange('prodCategory', e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition">
          {categorias.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryName}>
              {cat.categoryName}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="prodDesc" className="block text-sm font-semibold text-gray-800">Descripción</label>
          <button
            type="button"
            onClick={handleGenerateDescription}
            disabled={isGenerating || !productData.prodName}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaMagic />}
            {isGenerating ? 'Generando...' : 'Generar con IA'}
          </button>
        </div>
        <textarea id="prodDesc" value={productData.prodDesc} onChange={(e) => handleChange('prodDesc', e.target.value)} rows={8} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-700" />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1">Imágenes</label>
        <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {imagePreviews.map((preview, index) => (
            <div key={`${preview}-${index}`} className="relative group aspect-square">
              <img src={preview} alt={`Previsualización ${index + 1}`} className="h-full w-full object-cover rounded-md shadow-sm" />
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