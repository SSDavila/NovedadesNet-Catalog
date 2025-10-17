'use client';

import { useState, useEffect, FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { User } from '../page';

interface AddUserModalProps {
  onClose: () => void;
  onSave: (user: Omit<User, 'userId'>) => void;
}

export default function AddUserModal({ onClose, onSave }: AddUserModalProps) {

  const [newUser, setNewUser] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    userRole: 'VENDEDOR',
    userIsActive: true,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); 
    onSave(newUser);    
  };

  if (!isMounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Añadir Nuevo Usuario</h2>
          <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-800 transition-colors">
            <FaTimes />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" name="userName" id="userName" value={newUser.userName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" name="userEmail" id="userEmail" value={newUser.userEmail} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="userPassword" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input type="password" name="userPassword" id="userPassword" value={newUser.userPassword} onChange={handleChange} required minLength={8} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
              <select
                name="userRole"
                id="userRole"
                value={newUser.userRole}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="VENDEDOR">Vendedor</option>
                <option value="ADMINISTRADOR">Administrador</option>
                <option value="SUPER_ADMINISTRADOR">Super Administrador</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancelar
          </button>

          <button type="submit" className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
            Crear Usuario
          </button>
        </div>
      </form>
    </div>,
    document.body
  );
}
