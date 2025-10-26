'use client';

interface InventoryTabsProps {
  activeTab: 'stock' | 'movements';
  onTabChange: (tab: 'stock' | 'movements') => void;
}

export default function InventoryTabs({ activeTab, onTabChange }: InventoryTabsProps) {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        <button
          onClick={() => onTabChange('stock')}
          className={`${activeTab === 'stock' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
        >
          Stock Actual
        </button>
        <button
          onClick={() => onTabChange('movements')}
          className={`${activeTab === 'movements' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200`}
        >
          Historial de Movimientos
        </button>
      </nav>
    </div>
  );
}