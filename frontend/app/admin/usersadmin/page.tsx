'use client';

import { useState } from 'react';
import UserTable from './components/UserTable';
import EditUserModal from './components/EditUserModal';
import AddUserModal from './components/AddUserModal';
import ConfirmationModal from '@/components/ConfirmationModal';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/constants';
import { useNotification } from '@/components/Notifications/NotificationContext';
import { User } from '@/interfaces';

export default function UsersAdminPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { addNotification } = useNotification();

  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/users`);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      return response.json();
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (userToSave: User & { userPassword?: string }) => {
      const { userId, ...updateData } = userToSave;

      if (updateData.userPassword === '') {
        delete updateData.userPassword;
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {

        const errorData = await response.json().catch(() => ({ message: 'Failed to update user' }));
        throw new Error(errorData.message || 'Failed to update user');
      }
      return response.json();
    },
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['users'] });
      addNotification('Usuario guardado con éxito', 'success');
      handleCloseModal();
    },
    onError: (err: Error) => {
      console.error('Error al guardar el usuario:', err.message);
      addNotification(err.message, 'error');
    },
  });

  const createUserMutation = useMutation({
    mutationFn: async (newUser: Omit<User, 'userId'>) => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addNotification('Usuario creado con éxito', 'success');
      handleCloseModal();
    },
    onError: (err: Error) => {
      addNotification(err.message, 'error');
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addNotification('Usuario eliminado correctamente', 'info');
      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    },
    onError: (err: Error) => {
      addNotification(err.message, 'error');
    }
  });

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
  };

  const handleSaveUser = (userToSave: User & { userPassword?: string }) => {
    updateUserMutation.mutate(userToSave);
  };

  const handleCreateUser = (newUser: Omit<User, 'userId'>) => {
    createUserMutation.mutate(newUser);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedUser) deleteUserMutation.mutate(selectedUser.userId);
  };

  if (isLoading) return <div className="p-8 text-center">Cargando usuarios...</div>;
  if (isError) return <div className="p-8 text-center text-red-600">Error al cargar usuarios: {error.message}</div>;

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
        <UserTable users={users} onEdit={openEditModal} onDelete={openDeleteModal} />
      </main>

      {isEditModalOpen && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={handleCloseModal}
          onSave={handleSaveUser}
          isSaving={updateUserMutation.isPending}
        />
      )}
      {isAddModalOpen && (
        <AddUserModal onClose={handleCloseModal} onSave={handleCreateUser} />
      )}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar al usuario "${selectedUser?.userName}"? Esta acción no se puede deshacer.`}
        isConfirming={deleteUserMutation.isPending}
      />
    </div>
  );
}
