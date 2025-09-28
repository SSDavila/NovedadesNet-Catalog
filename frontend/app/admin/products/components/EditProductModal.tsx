'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes, FaImage, FaSpinner } from 'react-icons/fa';
import Notification from '@/components/Notification';
import { Product } from '@/interfaces/product';
import { getProductImageUrl } from '@/lib/utils';

interface Categoria {
  categoryId: number;
  categoryName: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onProductUpdated: (product: Product) => void;
}

export default function EditProductModal({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}: EditProductModalProps) {
  const [nombre, setNombre] = useState(product.prodName);
  const [precio, setPrecio] = useState(String(product.prodPrice));
  const [stock, setStock] = useState(String(product.prodStock));
  const [descripcion, setDescripcion] = useState(product.prodDesc || '');
  const [categoria, setCategoria] = useState(product.prodCategory || '');
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [existingImages, setExistingImages] = useState<string[]>([]);

  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setNombre(product.prodName);
      setPrecio(String(product.prodPrice));
      setStock(String(product.prodStock));
      setDescripcion(product.prodDesc || '');
      setCategoria(product.prodCategory || '');
      setExistingImages(product.prodImages || []);
      setNewImages([]);
      setNewImagePreviews([]);
      setImagesToDelete([]);
      setError(null);

      const fetchCategorias = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
          if (!response.ok) throw new Error('No se pudieron cargar las categorías');
          const data: Categoria[] = await response.json();
          setCategorias(data);
          if (!product.prodCategory && data.length > 0) {
            setCategoria(data[0].categoryName);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategorias();
    }
  }, [isOpen, product]);

  useEffect(() => {
    return () => {
      newImagePreviews.forEach((file) => URL.revokeObjectURL(file));
    };
  }, [newImagePreviews]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFilesWithPreview = acceptedFiles.map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      })
    );
    setNewImages((prev) => [...prev, ...newFilesWithPreview]);
    setNewImagePreviews((prev) => [...prev, ...newFilesWithPreview.map((f) => f.preview)]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleRemoveExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const handleRemoveNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio || !stock || !descripcion || !categoria) return;
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('prodName', nombre);
    formData.append('prodPrice', precio);
    formData.append('prodStock', stock);
    formData.append('prodDesc', descripcion);
    formData.append('prodCategory', categoria);

    newImages.forEach((img) => formData.append('images', img));

    if (imagesToDelete.length > 0) {
      formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${product.prodId}`,
        {
          method: 'PATCH',
          body: formData,
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar el producto');
      }

      onProductUpdated(data);
      onClose();
    } catch (error) {
      console.error(error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Editar Producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                Precio
              </label>
              <input 
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition"
              required
            >
              {categorias.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryName}>
                  {cat.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>

            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Imágenes actuales:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {existingImages.map((imageUrl, index) => (
                    <div key={imageUrl} className="relative group">
                      <img
                        src={getProductImageUrl(imageUrl)}
                        alt={`Imagen ${index + 1} de ${product.prodName}`}
                        className="h-24 w-24 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(imageUrl)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              } border-dashed rounded-md transition-colors duration-200 cursor-pointer`}
            >
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

            {newImagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-600 mb-2">Nuevas imágenes:</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {newImagePreviews.map((preview, index) => (
                    <div key={`${preview}-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`Previsualización ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
                      >
                        <FaTimes size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && (
            <Notification
              message={error}
              type="error"
              onClose={() => setError(null)}
            />
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Guardando...
                </>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
