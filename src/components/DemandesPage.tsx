import React, { useEffect, useState } from 'react'
import { getDemandesByType } from '../services/demandeService'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../utils/auth'
interface Demande {
  id: string
  titre: string
  type: string
  status: string
  createdAt: string
}

const DemandesPage: React.FC<{ type: string }> = ({ type }) => {
  const navigate = useNavigate()
  const [demandes, setDemandes] = useState<Demande[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDemandesByType(type) // par exemple
        // console.log('Demandes récupérées:', data)
        setDemandes(data.data)
        setLoading(false)
      } catch (error) {
        toast.error('Erreur lors du chargement des demandes')
        setLoading(false)
        setError('Erreur lors du chargement des demandes')
        // console.error('Erreur lors du chargement des demandes', error)
      }
    }

    fetchData()
  }, [])
  if (loading) return <div className="text-center">Chargement...</div>
  if (error) return <div className="text-red-500">Erreur lors de la récupération de la liste des demandes </div>
  return (

    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Liste des Demandes</h2>
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Titre</th>
              <th className="border border-gray-300 px-4 py-2">Type</th>
              <th className="border border-gray-300 px-4 py-2">Statut</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id} className="text-center">
                <td className="border px-4 py-2">{demande.titre}</td>
                <td className="border px-4 py-2">{demande.type}</td>
                <td className="border px-4 py-2">{demande.status}</td>
                <td className="border px-4 py-2">
                  {new Date(demande.createdAt).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/${getUser()?.role.toLowerCase()}/demandes/${demande.id}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                  >
                    Détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DemandesPage
