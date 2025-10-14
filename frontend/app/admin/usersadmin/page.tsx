'use client';

import { useState } from 'react';
import UserTable from './components/UserTable';
import EditUserModal from './components/EditUserModal';
import { FaPlus, FaUsers } from 'react-icons/fa';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Administrador' | 'Vendedor' | 'Cliente';
  status: 'Activo' | 'Inactivo';
  avatarUrl: string;
  permissions: {
    viewDashboard: boolean;
    manageProducts: boolean;
    manageUsers: boolean;
    manageOrders: boolean;
  };
}

const mockUsers: User[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan.perez@example.com', role: 'Administrador', status: 'Activo', avatarUrl: 'https://randomuser.me/api/portraits/men/1.jpg', permissions: { viewDashboard: true, manageProducts: true, manageUsers: true, manageOrders: true } },
  { id: '2', name: 'Ana Gómez', email: 'ana.gomez@example.com', role: 'Vendedor', status: 'Activo', avatarUrl: 'https://randomuser.me/api/portraits/women/2.jpg', permissions: { viewDashboard: true, manageProducts: true, manageUsers: false, manageOrders: true } },
  { id: '3', name: 'Carlos Sánchez', email: 'carlos.sanchez@example.com', role: 'Cliente', status: 'Inactivo', avatarUrl: 'https://randomuser.me/api/portraits/men/3.jpg', permissions: { viewDashboard: false, manageProducts: false, manageUsers: false, manageOrders: false } },
  { id: '4', name: 'Lucía Fernández', email: 'lucia.fernandez@example.com', role: 'Vendedor', status: 'Activo', avatarUrl: 'https://randomuser.me/api/portraits/women/4.jpg', permissions: { viewDashboard: false, manageProducts: true, manageUsers: false, manageOrders: true } },
];

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
  };

  const handleSaveUser = (updatedUser: User) => {
    setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
    handleCloseModal();
  };

  return (
    <div className="p-6 sm:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FaUsers />
            Administración de Usuarios
          </h1>
          <p className="text-gray-600 mt-1">Gestiona los roles y permisos de los usuarios de tu plataforma.</p>
        </div>
        <button className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Añadir Usuario
        </button>
      </header>

      <main>
        <UserTable users={users} onEdit={handleEditUser} />
      </main>

      {editingUser && (
        <EditUserModal user={editingUser} onClose={handleCloseModal} onSave={handleSaveUser} />
      )}
    </div>
  );
}

