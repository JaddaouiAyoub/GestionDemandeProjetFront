import React, { useEffect, useState } from 'react'
import { getAllUsers, deleteUser, User } from '../../services/userService'
import { toast } from 'react-toastify'
import UserModal from '../../components/UserModal'
import { FaAd, FaEdit, FaPlus, FaTrash } from 'react-icons/fa'

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const loadUsers = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
      setLoading(false)
    } catch (err) {
      toast.error('Erreur lors du chargement des utilisateurs')
      setError('Erreur lors du chargement')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleAdd = () => {
    setSelectedUser(null)
    setIsModalOpen(true)
  }

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      try {
        await deleteUser(id)
        toast.success('Utilisateur supprimé')
        loadUsers()
      } catch {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  if (loading) return <div className="text-center">Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">👤 Liste des Utilisateurs</h2>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          <FaPlus />
        </button>
      </div>

      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Nom</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Rôle</th>
            <th className="border px-4 py-2">Téléphone</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="text-center">
              <td className="border px-4 py-2">{u.firstName} {u.lastName}</td>
              <td className="border px-4 py-2">{u.email}</td>
              <td className="border px-4 py-2">{u.role}</td>
              <td className="border px-4 py-2">{u.phone || '-'}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(u.id!)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <UserModal
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadUsers}
        />
      )}
    </div>
  )
}

export default UsersPage
