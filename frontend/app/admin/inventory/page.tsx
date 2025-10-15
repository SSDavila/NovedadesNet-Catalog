'use client';

import { FaWarehouse, FaSearch } from 'react-icons/fa';
import ProductStockTable from './components/ProductStockTable';

const mockProducts = [
  { id: 'PROD001', name: 'Lámpara Inteligente Solari', sku: 'LMP-SLR-01', stock: 42, lowStockThreshold: 10, category: 'Iluminación' },
  { id: 'PROD002', name: 'Auriculares Inalámbricos Sonus', sku: 'AUR-SNS-BLK', stock: 8, lowStockThreshold: 5, category: 'Audio' },
  { id: 'PROD003', name: 'Teclado Mecánico Quantum', sku: 'TEC-QNT-RGB', stock: 150, lowStockThreshold: 20, category: 'Periféricos' },
  { id: 'PROD004', name: 'Cámara de Seguridad Visus', sku: 'CAM-VIS-360', stock: 0, lowStockThreshold: 5, category: 'Seguridad' },
];

export default function InventoryPage() {
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
        <div className="relative mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Buscar producto por nombre o SKU..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full sm:w-64"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </header>

      <main>
        <ProductStockTable products={mockProducts} />
      </main>
    </div>
  );
}

