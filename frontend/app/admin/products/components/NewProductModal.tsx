'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaImage, FaTimes, FaSpinner } from 'react-icons/fa';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

interface Categoria {
  categoryId: number;
  categoryName: string;
}

export default function NewProductModal({ isOpen, onClose, onProductAdded }: NewProductModalProps) {
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {

      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdStock('');
      setProdCategory('');
      setImages([]);
      setImagePreviews([]);
      setError(null);
      setIsSubmitting(false);

      const fetchCategorias = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
          if (!response.ok) throw new Error('No se pudieron cargar las categorías');
          const data: Categoria[] = await response.json();
          setCategorias(data);
          if (data.length > 0) {
            setProdCategory(data[0].categoryName);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategorias();
    }
  }, [isOpen]);

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
    setImages(prev => [...prev, ...newFilesWithPreview]);
    setImagePreviews(prev => [...prev, ...newFilesWithPreview.map(f => f.preview)]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleRemoveNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Debes subir al menos una imagen.');
      return;
    }
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('prodName', prodName);
    formData.append('prodDescription', prodDesc);
    formData.append('prodPrice', prodPrice);
    formData.append('prodStock', prodStock);
    formData.append('prodCategory', prodCategory);
    images.forEach((image) => {
      formData.append('prodImages', image);
    });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = Array.isArray(errorData.message) ? errorData.message.join(', ') : errorData.message;
        throw new Error(message || 'Error al crear el producto');
      }

      onProductAdded();
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Nuevo Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-2">

          <div>
            <label htmlFor="prodName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input type="text" id="prodName" value={prodName} onChange={(e) => setProdName(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="prodPrice" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input type="number" id="prodPrice" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
            <div>
              <label htmlFor="prodStock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" id="prodStock" value={prodStock} onChange={(e) => setProdStock(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
            </div>
          </div>

          <div>
            <label htmlFor="prodCategory" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select id="prodCategory" value={prodCategory} onChange={(e) => setProdCategory(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition">
              {categorias.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="prodDesc" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea id="prodDesc" value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} rows={3} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
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

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center">
              {isSubmitting ? (<><FaSpinner className="animate-spin mr-2" /> Guardando...</>) : ('Guardar Producto')}
            </button>
          </div>
          </form>
      </div>
    </div>
  );
}