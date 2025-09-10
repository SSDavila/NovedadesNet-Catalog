export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Ventas</h2>
          <p className="text-gray-600 dark:text-gray-400">$12,340</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Usuarios</h2>
          <p className="text-gray-600 dark:text-gray-400">1,234</p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
          <h2 className="text-lg font-semibold">Productos</h2>
          <p className="text-gray-600 dark:text-gray-400">543</p>
        </div>
      </div>
    </div>
  );
}
