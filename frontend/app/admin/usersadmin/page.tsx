'use client';

import { useState } from 'react';
import UserTable from './components/UserTable';
import EditUserModal from './components/EditUserModal';
import AddUserModal from './components/AddUserModal';
import { FaPlus, FaUsers } from 'react-icons/fa';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '@/lib/api';

export interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userRole: string;
  userIsActive: boolean;
}

export default function UsersAdminPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await fetch(API_ENDPOINTS.users);
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      return response.json();
    },
  });

  // 3. Hook `useMutation` para actualizar un usuario
  const updateUserMutation = useMutation({
    mutationFn: async (userToSave: User & { userPassword?: string }) => {
      const { userId, ...updateData } = userToSave; // `updateData` ahora incluye userIsActive

      // Asegurarse de no enviar la contraseña si está vacía
      if (updateData.userPassword === '') {
        delete updateData.userPassword;
      }

      const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        // Intentar obtener un mensaje de error más detallado del backend
        const errorData = await response.json().catch(() => ({ message: 'Failed to update user' }));
        throw new Error(errorData.message || 'Failed to update user');
      }
      return response.json();
    },
    onSuccess: () => {
      // Si la mutación es exitosa, invalida la query de 'users' para que se vuelva a cargar
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseModal();
    },
    onError: (err) => {
      // Aquí puedes mostrar una notificación de error al usuario
      console.error('Error al guardar el usuario:', err);
      alert(`Error: ${err.message}`);
    },
  });


  // 4. Hook `useMutation` para crear un usuario
  const createUserMutation = useMutation({
    mutationFn: async (newUser: Omit<User, 'userId'>) => {
      const response = await fetch(API_ENDPOINTS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      handleCloseModal();
    },
    onError: (err) => {
      console.error('Error al crear el usuario:', err);
      alert(`Error: ${err.message}`);
    }
  });

  // 5. Hook `useMutation` para eliminar un usuario
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`${API_ENDPOINTS.users}/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (err) => {
      console.error('Error al eliminar el usuario:', err);
      alert(`Error: ${err.message}`);
    }
  });

  // --- Funciones manejadoras (ahora mucho más simples) ---

  const handleEditUser = (user: User) => setSelectedUser(user);

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsAddModalOpen(false);
  };

  const handleSaveUser = (userToSave: User & { userPassword?: string }) => {
    updateUserMutation.mutate(userToSave);
  };

  const handleCreateUser = (newUser: Omit<User, 'userId'>) => {
    createUserMutation.mutate(newUser);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      deleteUserMutation.mutate(userId);
    }
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
        <UserTable users={users} onEdit={handleEditUser} onDelete={handleDeleteUser} />
      </main>

      {selectedUser && (
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
    </div>
  );
}
