import React from 'react'
import { getUser } from '../utils/auth'
import { useNavigate } from 'react-router-dom'
import { logout } from '../services/authService'
// import { toast } from 'react-toastify'

export default function Dashboard() {
  const user = getUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    // toast.info('Déconnecté avec succès')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-2 text-gray-800">Bienvenue 👋</h1>
        <p className="text-gray-600 mb-4">
          Connecté en tant que <strong>{user?.role}</strong>
        </p>
        <p className="mb-6">
          ID utilisateur : <code className="text-sm bg-gray-100 px-2 py-1 rounded">{user?.id}</code>
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
