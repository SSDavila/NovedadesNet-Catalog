import { User } from '@/interfaces';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const roleClasses: Record<string, string> = {
  SUPER_ADMINISTRADOR: 'bg-purple-100 text-purple-800',
  ADMINISTRADOR: 'bg-red-100 text-red-800',
  VENDEDOR: 'bg-blue-100 text-blue-800',
};

const statusClasses: Record<string, string> = {
  true: 'bg-green-100 text-green-800',
  false: 'bg-yellow-100 text-yellow-800',
};

const roleDisplayNames: Record<string, string> = {
  SUPER_ADMINISTRADOR: 'Super Admin',
  ADMINISTRADOR: 'Administrador',
  VENDEDOR: 'Vendedor',
};

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.userName}</div>
                  <div className="text-sm text-gray-500">{user.userEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClasses[user.userRole]}`}>
                    {roleDisplayNames[user.userRole]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses[String(user.userIsActive)]}`}>
                    {user.userIsActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => onEdit(user)} className="text-blue-600 hover:text-blue-900 transition-colors">
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No se encontraron usuarios.
        </div>
      )}
    </div>
  );
}
