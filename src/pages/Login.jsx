import React, { useState } from 'react'
import { login } from '../services/authService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUser } from '../utils/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Email et mot de passe sont requis')
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      toast.success('Connexion réussie')
      navigate(`/${getUser()?.role.toLowerCase()}/dashboard`)
    } catch (error) {
      console.log('Erreur de connexion:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen justify-center items-center bg-gray-50 px-4">
      <div className="flex w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Formulaire */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-4">
            <div className="text-center">
              <img src="/logo.jpeg" alt="Logo" className="h-28 mx-auto mb-4" />
              <h2 className="text-sm font-medium text-gray-500">Bienvenue à nouveau</h2>
              <h1 className="text-2xl font-semibold text-gray-800">Connectez-vous</h1>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-sm text-gray-600">Adresse e-mail</label>
                <input
                  type="email"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-3 rounded-md transition ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          </div>
        </div>

        {/* Image de droite */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="bg2.jpg"
            alt="Illustration"
            className="object-cover h-full w-full"
          />
        </div>
      </div>
    </div>
  )
}
