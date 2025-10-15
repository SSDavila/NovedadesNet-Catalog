import { FaPlus, FaMinus } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  category: string;
}

interface ProductStockTableProps {
  products: Product[];
}

const getStockStatus = (stock: number, threshold: number) => {
  if (stock === 0) return { text: 'Sin Stock', className: 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-600/20' };
  if (stock <= threshold) return { text: 'Bajo Stock', className: 'bg-yellow-100 text-yellow-800 ring-1 ring-inset ring-yellow-600/20' };
  return { text: 'En Stock', className: 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-600/20' };
};

export default function ProductStockTable({ products }: ProductStockTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Stock Actual</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ajustar</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => {
              const status = getStockStatus(product.stock, product.lowStockThreshold);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">{product.stock}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${status.className}`}>
                      {status.text}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"><FaMinus size={12} /></button>
                      <button className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600"><FaPlus size={12} /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

