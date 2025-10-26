'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaWarehouse, FaSearch } from 'react-icons/fa';
import ProductStockTable from './components/ProductStockTable';
import AdjustStockModal from './components/AdjustStockModal';
import { ProductStock, InventoryMovement } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';
import InventoryTabs from './components/InventoryTabs';
import InventoryMovementsTable from './components/InventoryMovementsTable';

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductStock | null>(null);
  const queryClient = useQueryClient();
  const { addNotification } = useNotification();

  const { data: products = [], isLoading: isLoadingStock, isError: isErrorStock, error: errorStock } = useQuery<ProductStock[]>({
    queryKey: ['productStock'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/inventory/stock`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('No se pudo cargar el stock de productos.');
      return response.json();
    },
  });

  const { data: movements = [], isLoading: isLoadingMovements, isError: isErrorMovements, error: errorMovements } = useQuery<InventoryMovement[]>({
    queryKey: ['inventoryMovements'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/inventory/movements`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('No se pudo cargar el historial de movimientos.');
      return response.json();
    },
  });

  const adjustStockMutation = useMutation({
    mutationFn: async ({ productId, quantityChange, reason }: { productId: string, quantityChange: number, reason: string }) => {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${API_BASE_URL}/inventory/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify([{ productId, quantityChange, reason }]),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al ajustar el stock.');
      }
      return response.json();
    },
    onSuccess: () => {
      addNotification('Stock ajustado con éxito', 'success');
      queryClient.invalidateQueries({ queryKey: ['productStock'] });
      queryClient.invalidateQueries({ queryKey: ['inventoryMovements'] });
      setIsAdjustModalOpen(false);
    },
    onError: (error: Error) => {
      addNotification(error.message, 'error');
    },
  });

  const handleOpenAdjustModal = (product: ProductStock) => {
    setSelectedProduct(product);
    setIsAdjustModalOpen(true);
  };

  const handleAdjustSubmit = (productId: string, quantityChange: number, reason: string) => {
    adjustStockMutation.mutate({ productId, quantityChange, reason });
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(p =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productSku?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const isLoading = isLoadingStock || isLoadingMovements;
  const isError = isErrorStock || isErrorMovements;
  const error = errorStock || errorMovements;

  if (isError) return <div className="p-8 text-center text-red-600">Error: {error?.message}</div>;

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaWarehouse />
            Gestión de Inventario
          </h1>
          <p className="text-gray-600 mt-1">Monitoriza y ajusta el stock de tus productos.</p>
        </div>
        {activeTab === 'stock' && (
          <div className="relative mt-4 sm:mt-0">
            <input
              type="text"
              placeholder="Buscar producto por nombre o SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        )}
      </header>

      <InventoryTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main>
        {isLoading ? <div className="text-center p-8">Cargando...</div> : (
          activeTab === 'stock' ? <ProductStockTable products={filteredProducts} onAdjustStock={handleOpenAdjustModal} /> : <InventoryMovementsTable movements={movements} />
        )}
      </main>

      <AdjustStockModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        product={selectedProduct}
        onSubmit={handleAdjustSubmit}
        isSubmitting={adjustStockMutation.isPending}
      />
    </div>
  );
}
