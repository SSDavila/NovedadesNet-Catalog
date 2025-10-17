'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../page';
import { FaSpinner, FaTimes } from 'react-icons/fa';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User & { userPassword?: string }) => void;
  isSaving: boolean;
}

export default function EditUserModal({ user, onClose, onSave, isSaving }: EditUserModalProps) {

  const [editedUser, setEditedUser] = useState<User & { userPassword?: string }>(user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    const processedValue = name === 'userIsActive' ? value === 'true' : value;
    setEditedUser(prev => ({ 
      ...prev, 
      [name]: processedValue 
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Usuario: {user.userName}</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" name="userName" id="userName" value={editedUser.userName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="userEmail" id="userEmail" value={editedUser.userEmail} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                name="userPassword"
                id="userPassword"
                value={editedUser.userPassword || ''}
                onChange={handleChange}
                minLength={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>
            <div>
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
                Rol del Usuario
              </label>
              <select
                id="userRole"
                name="userRole"
                value={editedUser.userRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VENDEDOR">VENDEDOR</option>
                <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                <option value="SUPER_ADMINISTRADOR">SUPER ADMINISTRADOR</option>
              </select>
            </div>

             <div>
              <label htmlFor="userIsActive" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="userIsActive"
                name="userIsActive"
                value={String(editedUser.userIsActive)}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={isSaving}
            className="px-4 py-2 w-32 flex justify-center items-center bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <FaSpinner className="animate-spin" />
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
