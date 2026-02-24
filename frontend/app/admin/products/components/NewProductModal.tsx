'use client';

import { useState, FormEvent, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { FaUsersGear } from 'react-icons/fa6';
import { Category, ProductImage, User } from '@/interfaces';
import ProductForm from './ProductForm';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { API_BASE_URL } from '@/lib/constants';
import { ProductDetailPreview } from './ProductDetailPreview';
import { ImageState } from './EditProductModal';
import { backdropVariants, modalVariants } from '@/app/animations/modalVariants';
import NewCategoryModal from '@/app/admin/categories/components/NewCategoryModal';

interface NewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  createProductMutation: any;
}

const INITIAL_STATE = {
  productName: '',
  productDescription: '',
  productPrice: '',
  productOfferPrice: '0',
  productCost: '',
  productStock: '',
  categoryId: '',
};

export default function NewProductModal({ isOpen, onClose, createProductMutation }: NewProductModalProps) {
  const [productData, setProductData] = useState(INITIAL_STATE);
  const [currentImages, setCurrentImages] = useState<ImageState[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isNewCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [activeSellers, setActiveSellers] = useState<User[]>([]);
  const [sellerOverrides, setSellerOverrides] = useState<Record<number, string>>({});
  const { addNotification } = useNotification();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('No se pudieron cargar las categorías.');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSellers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) throw new Error('No se pudieron cargar los vendedores.');
        const allUsers: User[] = await response.json();
        const sellers = allUsers.filter(u => u.userIsActive && (u.userRole === 'VENDEDOR' || u.userRole === 'ADMIN'));
        setActiveSellers(sellers);
      } catch (error) {
        console.error(error);
      }
    };

    if (isOpen) {
      fetchCategories();
      fetchSellers();
    }

    return () => {
      currentImages.forEach(img => {
        if (img.file) URL.revokeObjectURL(URL.createObjectURL(img.file));
      });
    };
  }, [isOpen]);

  const handleClose = () => {
    setProductData(INITIAL_STATE);
    setIsGenerating(false);
    setCurrentImages([]);
    setSellerOverrides({});
    onClose();
  };

  const handleCategoryCreated = async () => {
    setNewCategoryModalOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('No se pudieron recargar las categorías.');
      const data = await response.json();
      setCategories(data);
      addNotification('Categoría creada. Ya puedes seleccionarla.', 'success');
    } catch (error) {
      console.error(error);
      addNotification('Error al recargar las categorías.', 'error');
    }
  };

  const handleGenerateDescription = async () => {
    if (!productData.productName) {
      addNotification('Por favor, ingresa un nombre de producto primero.', 'warning');
      return;
    }
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/ai/generate-description`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productName: productData.productName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en la respuesta de la IA');
      }
      const data = await response.json();
      setProductData(prev => ({ ...prev, productDescription: data.description }));
    } catch (err: any) {
      addNotification(err.message, 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!productData.productName || !productData.productPrice || !productData.productStock || !productData.categoryId) {
      addNotification('Por favor, completa todos los campos requeridos.', 'warning');
      return;
    }

    const newImages = currentImages.map(img => img.file).filter((file): file is File => !!file);
    if (newImages.length === 0) {
      addNotification('Debes subir al menos una imagen.', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('productName', productData.productName.trim());
    formData.append('productDescription', productData.productDescription.trim());
    formData.append('productPrice', productData.productPrice);
    formData.append('productOfferPrice', productData.productOfferPrice || '0');
    formData.append('productStock', productData.productStock);
    formData.append('categoryId', productData.categoryId);

    newImages.forEach((image) => {
      formData.append('images', image);
    });

    // Add seller overrides as a JSON string
    const overridesArray = Object.entries(sellerOverrides)
      .filter(([_, value]) => value !== '')
      .map(([userId, commission]) => ({ userId: parseInt(userId), commission: parseFloat(commission) }));

    formData.append('sellerCommissions', JSON.stringify(overridesArray));

    createProductMutation.mutate(formData);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={backdropVariants}
            onClick={handleClose}
          >
            <motion.div
              className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col relative"
              variants={modalVariants}
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-2xl font-bold text-gray-900">Nuevo Producto</h2>
                <button onClick={handleClose} className="text-gray-500 hover:text-gray-800 transition p-2 rounded-full hover:bg-gray-100">
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-grow flex flex-col overflow-hidden">
                <div className="grid lg:grid-cols-7 flex-grow overflow-y-auto">
                  <div className="lg:col-span-3 overflow-y-auto p-8 bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    <div className="space-y-8">
                      <ProductForm
                        productData={productData}
                        onProductDataChange={setProductData}
                        currentImages={currentImages}
                        onCurrentImagesChange={setCurrentImages}
                        isGenerating={isGenerating}
                        onGenerateDescription={handleGenerateDescription}
                        categories={categories}
                        onAddNewCategory={() => setNewCategoryModalOpen(true)}
                      />

                      <div className="border-t pt-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <span className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><FaUsersGear className="w-4 h-4" /></span>
                          Comisiones por Vendedor
                        </h3>
                        <p className="text-sm text-gray-500 mb-6 font-medium">Define comisiones personalizadas para vendedores específicos. Si no se define una, usarán la Comisión General.</p>

                        <div className="space-y-3">
                          {activeSellers.length > 0 ? (
                            activeSellers.map(seller => (
                              <div key={seller.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-white hover:border-indigo-100 group">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-gray-700">{seller.userName}</span>
                                  <span className="text-xs text-gray-400 font-medium">{seller.userEmail}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    placeholder="0"
                                    value={sellerOverrides[seller.userId] || ''}
                                    onChange={(e) => setSellerOverrides(prev => ({ ...prev, [seller.userId]: e.target.value }))}
                                    className="w-20 px-2 py-1.5 text-right font-bold text-indigo-600 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none transition-all group-hover:border-indigo-200"
                                    min="0"
                                    max="100"
                                    step="0.1"
                                  />
                                  <span className="text-gray-400 font-bold">%</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-400 italic py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">No hay vendedores activos registrados.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:col-span-4 lg:flex flex-col bg-gray-100 p-5 border-l overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
                    <div className="w-full">
                      <ProductDetailPreview name={productData.productName} category={categories.find(c => c.categoryId === productData.categoryId)?.categoryName || ''} price={parseFloat(productData.productPrice)} offerPrice={parseFloat(productData.productOfferPrice)} stock={parseInt(productData.productStock, 10)} description={productData.productDescription} imagePreviews={currentImages.map(img => img.file ? URL.createObjectURL(img.file) : img.existingImage!.productImageUrl)} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 p-6 border-t bg-gray-50 rounded-b-2xl">
                  <button type="button" onClick={handleClose} disabled={createProductMutation.isPending} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50">Cancelar</button>
                  <button type="submit" disabled={createProductMutation.isPending} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:bg-blue-400 flex items-center gap-2">
                    {createProductMutation.isPending ? (<><FaSpinner className="animate-spin" /> Guardando...</>) : ('Guardar Producto')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setNewCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </>
  );
}
