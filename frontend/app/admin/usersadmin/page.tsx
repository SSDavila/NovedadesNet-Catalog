'use client';

import { useState, useEffect } from 'react';
import UserTable from './components/UserTable';
import EditUserModal from './components/EditUserModal';
import AddUserModal from './components/AddUserModal';
import { FaPlus, FaUsers } from 'react-icons/fa';

export enum UserRole {
  SUPER_ADMINISTRADOR = 'SUPER_ADMINISTRADOR',
  ADMINISTRADOR = 'ADMINISTRADOR',
  VENDEDOR = 'VENDEDOR',
}
 
export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: UserRole;
  userIsActive: boolean;
  avatarUrl: string;
}

const API_URL = 'http://localhost:5000/api/v1/users';

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      const usersWithAvatars = data.map((user: Omit<User, 'avatarUrl'>, index: number) => ({
        ...user,
        avatarUrl: `https://i.pravatar.cc/150?u=${user.userEmail}`
      }));
      setUsers(usersWithAvatars);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Aquí podrías manejar el error, por ejemplo, mostrando una notificación.
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleCloseModal = () => {
    setEditingUser(null);
    setIsAddModalOpen(false);
  };

  const handleSaveUser = async (updatedUser: User) => {
    try {
      const response = await fetch(`${API_URL}/${updatedUser.userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers(); // Recargar la lista de usuarios
    } catch (error) {
      console.error('Error saving user:', error);
    }
    handleCloseModal();
  };

  const handleCreateUser = async (newUser: Omit<User, 'userId' | 'avatarUrl'>) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      await fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
    handleCloseModal();
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await fetch(`${API_URL}/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
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
        <button onClick={() => setIsAddModalOpen(true)} className="mt-4 sm:mt-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <FaPlus />
          Añadir Usuario
        </button>
      </header>

      <main>
        <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      </main>

      {editingUser && (
        <EditUserModal user={editingUser} onClose={handleCloseModal} onSave={handleSaveUser} />
      )}
      {isAddModalOpen && (
        <AddUserModal onClose={handleCloseModal} onSave={handleCreateUser} />
      )}
    </div>
  );
}
