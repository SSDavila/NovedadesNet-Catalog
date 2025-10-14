'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { User } from '../page';
import { FaTimes } from 'react-icons/fa';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

export default function EditUserModal({ user, onClose, onSave }: EditUserModalProps) {
  const [editedUser, setEditedUser] = useState<User>(user);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handlePermissionChange = (permission: keyof User['permissions']) => {
    setEditedUser(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission],
      },
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave(editedUser);
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <header className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Editar Usuario: {user.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <FaTimes />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rol del Usuario
              </label>
              <select
                id="role"
                value={editedUser.role}
                onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value as User['role'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Administrador</option>
                <option>Vendedor</option>
                <option>Cliente</option>
              </select>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Permisos</h3>
              <div className="space-y-2">
                {(Object.keys(user.permissions) as Array<keyof User['permissions']>).map((key) => (
                  <div key={key} className="flex items-center">
                    <input
                      id={key}
                      type="checkbox"
                      checked={editedUser.permissions[key]}
                      onChange={() => handlePermissionChange(key)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={key} className="ml-2 block text-sm text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  </div>
                ))}
              </div>
            </div>

             <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                id="status"
                value={editedUser.status}
                onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value as User['status'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option>Activo</option>
                <option>Inactivo</option>
              </select>
            </div>
          </div>
        </form>

        <footer className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
            Guardar Cambios
          </button>
        </footer>
      </div>
    </div>,
    document.body
  );
}

