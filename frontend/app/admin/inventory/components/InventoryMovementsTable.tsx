'use client';

import { InventoryMovement } from '@/interfaces';
import { FaArrowDown, FaArrowUp, FaExchangeAlt } from 'react-icons/fa';

interface InventoryMovementsTableProps {
  movements: InventoryMovement[];
}

const movementTypeInfo: { [key: string]: { icon: React.ElementType, color: string, label: string } } = {
  'MANUAL_ADJUSTMENT': { icon: FaExchangeAlt, color: 'text-blue-500', label: 'Ajuste Manual' },
  'SALE': { icon: FaArrowDown, color: 'text-red-500', label: 'Venta' },
  'INITIAL_STOCK': { icon: FaArrowUp, color: 'text-green-500', label: 'Stock Inicial' },
  'RETURN': { icon: FaArrowUp, color: 'text-green-500', label: 'Devolución' },
};

export default function InventoryMovementsTable({ movements }: InventoryMovementsTableProps) {
  if (movements.length === 0) {
    return <div className="text-center py-12 text-gray-500">No hay movimientos de inventario registrados.</div>;
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs text-gray-800 uppercase font-semibold">
          <tr>
            <th scope="col" className="px-6 py-3">Fecha</th>
            <th scope="col" className="px-6 py-3">Producto</th>
            <th scope="col" className="px-6 py-3">Tipo</th>
            <th scope="col" className="px-6 py-3 text-center">Cantidad</th>
            <th scope="col" className="px-6 py-3">Usuario</th>
            <th scope="col" className="px-6 py-3">Razón / Detalle</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((move) => {
            const typeInfo = movementTypeInfo[move.inventoryMovementType] || { icon: FaExchangeAlt, color: 'text-gray-500', label: move.inventoryMovementType };
            const quantityColor = move.inventoryMovementQuantity > 0 ? 'text-green-600' : 'text-red-600';
            const quantitySign = move.inventoryMovementQuantity > 0 ? '+' : '';

            return (
              <tr key={move.inventoryMovementId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(move.inventoryMovementCreatedAt).toLocaleString('es-EC', {
                    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                  {move.product.productName}
                  <span className="block text-xs text-gray-500 font-mono">{move.product.productSku || ''}</span>
                </th>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-2 ${typeInfo.color}`}>
                    <typeInfo.icon />
                    {typeInfo.label}
                  </span>
                </td>
                <td className={`px-6 py-4 text-center font-bold text-lg ${quantityColor}`}>
                  {quantitySign}{move.inventoryMovementQuantity}
                </td>
                <td className="px-6 py-4">
                  {move.user.userName}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {move.inventoryMovementReason || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}