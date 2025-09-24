'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes, FaImage } from 'react-icons/fa';

interface Categoria {
  categoryId: number;
  categoryName: string;
}

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function NewProductModal({ isOpen, onClose, onProductAdded }: NewProductModalProps) {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchCategorias = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`); 
          if (!response.ok) throw new Error('No se pudieron cargar las categorías');
          const data: Categoria[] = await response.json();
          setCategorias(data);
          if (data.length > 0) {
            setCategoria(data[0].categoryName);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchCategorias();
    }
  }, [isOpen]);

  // Limpiar URLs de previsualización para evitar fugas de memoria
  useEffect(() => {
    return () => {
      imagePreviews.forEach(file => URL.revokeObjectURL(file));
    };
  }, [imagePreviews]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setImagenes(prev => [...prev, ...newFiles]);
    setImagePreviews(prev => [...prev, ...newFiles.map(f => f.preview)]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleRemoveImage = (index: number) => {
    const newImagenes = [...imagenes];
    const newImagePreviews = [...imagePreviews];

    URL.revokeObjectURL(newImagePreviews[index]);

    newImagenes.splice(index, 1);
    newImagePreviews.splice(index, 1);

    setImagenes(newImagenes);
    setImagePreviews(newImagePreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !precio || !stock || !descripcion || !categoria) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('prodName', nombre);
    formData.append('prodPrice', precio);
    formData.append('prodStock', stock);
    formData.append('prodDesc', descripcion);
    formData.append('prodCategory', categoria);
    imagenes.forEach(img => formData.append('images', img));

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { 
        method: 'POST', 
        body: formData 
      });

      if (!response.ok) throw new Error('Error al crear el producto');
      
      onProductAdded();
      setNombre('');
      setPrecio('');
      setStock('');
      setDescripcion('');
      setImagenes([]);
      setImagePreviews([]);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative animate-fadeIn">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Agregar nuevo producto</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                id="precio"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                id="stock"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-white transition"
              required
            >
              {categorias.map(cat => (
                <option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes</label>
            <div {...getRootProps()} className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300'} border-dashed rounded-md transition-colors duration-200 cursor-pointer`}>
              <input {...getInputProps()} />
              <div className="space-y-1 text-center">
                <FaImage className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <p className="relative bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Sube tus archivos</span>
                  </p>
                  <p className="pl-1">o arrástralos aquí</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
              </div>
            </div>
          </div>

          {imagePreviews.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700">Imágenes seleccionadas:</p>
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`preview ${index}`} className="h-24 w-24 object-cover rounded-md shadow-sm" />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 outline-none"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
