'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Combobox } from '@headlessui/react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, rectSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaTrash, FaWandMagicSparkles, FaSpinner, FaTags, FaPlus } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';
import { HiChevronUpDown, HiCheck } from 'react-icons/hi2';
import { Category, ProductImage as ProductImageType } from '@/interfaces/index';
import { ImageState } from './EditProductModal';

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(' ');
}

interface ProductFormProps {
  productData: any;
  onProductDataChange: (data: any) => void;
  currentImages: ImageState[];
  onCurrentImagesChange: React.Dispatch<React.SetStateAction<ImageState[]>>;
  isGenerating: boolean;
  onGenerateDescription: () => void;
  categories: Category[];
  onAddNewCategory: () => void;
}

interface SortableImageProps {
  id: string;
  preview: string;
  index: number;
  onRemove: (index: number) => void;
}

function SortableImage({ id, preview, index, onRemove }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="relative group aspect-square w-full touch-none">
      <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute -top-1.5 -right-1.5 bg-red-600 text-white rounded-full p-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all hover:scale-110 shadow-lg active:scale-90"
        aria-label="Eliminar imagen"
      >
        <FaTrash size={11} />
      </button>
    </div>
  );
}

export default function ProductForm({
  productData,
  onProductDataChange,
  currentImages,
  onCurrentImagesChange,
  isGenerating,
  onGenerateDescription,
  categories,
  onAddNewCategory,
}: ProductFormProps) {
  const [showOfferPrice, setShowOfferPrice] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState('');

  useEffect(() => {

    if (productData.productOfferPrice && parseFloat(productData.productOfferPrice) > 0) {
      setShowOfferPrice(true);
    }
  }, [productData.productOfferPrice]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImageStates: ImageState[] = acceptedFiles.map(file => ({ file }));
    onCurrentImagesChange(prev => [...prev, ...newImageStates]);
  }, [onCurrentImagesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
  });

  const imagePreviews = currentImages.map(img =>
    img.file ? URL.createObjectURL(img.file) : img.existingImage!.productImageUrl
  );

  const handleRemoveImage = (index: number) => {
    const imageToRemove = currentImages[index];

    if (imageToRemove.file) {
      URL.revokeObjectURL(URL.createObjectURL(imageToRemove.file));
    }
    onCurrentImagesChange(currentImages.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onProductDataChange({ ...productData, [name]: value });
  };

  const handleToggleOfferPrice = () => {
    const newShowState = !showOfferPrice;
    setShowOfferPrice(newShowState);
    if (!newShowState) {

      onProductDataChange({ ...productData, productOfferPrice: '0' });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = imagePreviews.findIndex(preview => preview === active.id);
      const newIndex = imagePreviews.findIndex(preview => preview === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onCurrentImagesChange(arrayMove(currentImages, oldIndex, newIndex));
      }
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const selectedCategory = categories.find(c => c.categoryId === productData.categoryId) || null;

  const filteredCategories =
    categoryQuery === ''
      ? categories
      : categories.filter((category) => {
        return category.categoryName.toLowerCase().includes(categoryQuery.toLowerCase());
      });


  return (
    <div className="space-y-8">

      <fieldset>
        <legend className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">Imágenes del Producto</legend>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={imagePreviews} strategy={rectSortingStrategy}>
              {imagePreviews.map((preview, index) => (
                <SortableImage key={preview} id={preview} preview={preview} index={index} onRemove={handleRemoveImage} />
              ))}
            </SortableContext>
          </DndContext>
          <div {...getRootProps()} className={`aspect-square w-full flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer transition-colors ${isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'}`}>
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center text-gray-400 gap-1">
              <FaPlus size={20} />
              <span className="text-[10px] font-semibold text-gray-400 sm:block hidden">Subir foto</span>
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="productName" className="block text-sm font-semibold text-gray-800 mb-1.5">Nombre del Producto</label>
            <input type="text" name="productName" id="productName" value={productData.productName} onChange={handleChange} className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base" required />
          </div>
          <div>
            <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
              <span>Categoría</span>
              <button
                type="button"
                onClick={onAddNewCategory}
                className="p-1 rounded-md bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors text-xs flex items-center gap-1 font-medium"
                aria-label="Crear nueva categoría"
              >
                <FaPlus className="w-2.5 h-2.5" />
                <span>Nueva</span>
              </button>
            </label>
            <Combobox as="div" value={selectedCategory} onChange={(category: Category | null) => onProductDataChange({ ...productData, categoryId: category?.categoryId || '' })} nullable>
              <div className="relative">
                <Combobox.Button as="div">
                  <Combobox.Input
                    className="block w-full rounded-xl border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base pr-10"
                    onChange={(event) => setCategoryQuery(event.target.value)}
                    displayValue={(category: Category) => category?.categoryName || ''}
                    placeholder="Busca o selecciona una categoría"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-2 focus:outline-none pointer-events-none">
                    <HiChevronUpDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </Combobox.Button>

                {filteredCategories.length > 0 && (
                  <Combobox.Options className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredCategories.map((category) => (
                      <Combobox.Option
                        key={category.categoryId}
                        value={category}
                        className={({ active }) =>
                          classNames(
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                            active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span className={classNames('block truncate', selected && 'font-semibold')}>{category.categoryName}</span>
                            {selected && <span className={classNames('absolute inset-y-0 right-0 flex items-center pr-4', active ? 'text-white' : 'text-indigo-600')}><HiCheck className="h-5 w-5" aria-hidden="true" /></span>}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="productPrice" className="block text-sm font-semibold text-gray-800 mb-1.5">Precio ($)</label>
            <input
              type="number"
              name="productPrice"
              id="productPrice"
              value={productData.productPrice}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base"
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div>
            {showOfferPrice ? (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="productOfferPrice" className="block text-sm font-semibold text-gray-800">
                    Precio de Oferta ($)
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleOfferPrice}
                    className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                    title="Quitar oferta"
                  >
                    <FaTimes size={10} />
                    <span>Quitar</span>
                  </button>
                </div>
                <input
                  type="number"
                  name="productOfferPrice"
                  id="productOfferPrice"
                  value={productData.productOfferPrice}
                  onChange={handleChange}
                  className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                  Precio de Oferta
                </label>
                <button
                  type="button"
                  onClick={handleToggleOfferPrice}
                  className="w-full h-[46px] text-purple-600 font-semibold hover:text-purple-700 flex items-center justify-center gap-2 border-2 border-dashed border-purple-200 rounded-xl hover:border-purple-400 hover:bg-purple-50/50 transition-colors text-sm"
                >
                  <FaTags size={15} />
                  <span>Activar oferta</span>
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="productStock" className="block text-sm font-semibold text-gray-800 mb-1.5">Stock</label>
            <input
              type="number"
              name="productStock"
              id="productStock"
              value={productData.productStock}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base"
              required
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label htmlFor="productCost" className="block text-sm font-semibold text-gray-800 mb-1.5">Costo ($)</label>
            <input
              type="number"
              name="productCost"
              id="productCost"
              value={productData.productCost ?? ''}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 py-2.5 px-3 text-base"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </fieldset>

      <fieldset>
        <div className="flex justify-between items-center mb-4">
          <button type="button" onClick={onGenerateDescription} disabled={isGenerating || !productData.productName} className="flex items-center gap-2 text-xs bg-purple-100 text-purple-700 font-semibold px-2 py-1.5 rounded-md hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isGenerating ? <FaSpinner className="animate-spin" /> : <FaWandMagicSparkles />}
            Generar con IA
          </button>
        </div>
        <div>
          <textarea name="productDescription" id="productDescription" value={productData.productDescription} onChange={handleChange} rows={6} className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-base" />
        </div>
      </fieldset>
    </div>
  );
}