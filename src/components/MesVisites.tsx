// src/pages/visites/MesVisites.tsx
import { useEffect, useState } from 'react'
import { visiteService, TypeDemande } from '../services/visiteService'
import { toast } from 'react-toastify'
import { getUser } from '../utils/auth'
import AddVisiteModal from './AddVisiteModal'
import { FaInfo, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
interface Visite {
  id: number
  date: string
  remarques?: string
  responsableNom?: string
  dossierExecutionId: number
  createdAt: string
  typeVisite?: string // 🆕 Ajout du type de visite
}

export default function MesVisites({ typeDemande }) {
  const [visites, setVisites] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  

  const handleModalSuccess = (newVisite: Visite) => {
    setVisites([newVisite, ...visites])
    toast.success('Visite créée avec succès')
  }
  const handleRemove = async (id: number) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cette visite ?')) return
    try {
      await visiteService.remove(id)
      setVisites(visites.filter((v: Visite) => v.id !== id))
      toast.success('Visite supprimée avec succès')
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la suppression de la visite')
    }
  }

  useEffect(() => {
    const fetchVisites = async () => {
      try {
        const user = getUser()
        if (!user) {
          toast.error('Utilisateur non authentifié')
          return
        }
        // Si tu veux par type :
        if (typeDemande) {
          const data = await visiteService.getByType(typeDemande)
          setVisites(data.data.data || [])
          
        } else {
          const data = await visiteService.getByClient(Number(user.id))
          console.log('Visites récupérées:', data.data.data)
          setVisites(data.data.data || [])
        }
        // Sinon, par client :

      } catch (err) {
        console.error(err)
        toast.error('Erreur lors de la récupération des visites')
      } finally {
        setLoading(false)
      }
    }

    fetchVisites()
  }, [])

  if (loading) return <div className="text-center">Chargement...</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {getUser()?.role === 'CLIENT' ? '📅 Mes Visites' : '📅 Liste des Visites ' }
          </h2>
        {getUser()?.role !== 'CLIENT' && (
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            +
          </button>)
        }
      </div>

      {open && (
        <AddVisiteModal onClose={() => setOpen(false)} onSuccess={handleModalSuccess} typeDemande={typeDemande} />
      )}

      {visites.length === 0 ? (
        <p className="text-gray-600">Aucune visite pour le moment.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Date</th>
                {/* <th className="p-3 border">Responsable</th> */}
                <th className="p-3 border">Avancements</th>
                <th className="p-3 border">Créée le</th>
                <th className="p-3 border">Type de visite</th>
                
                  <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visites.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="p-3 border">
                    {new Date(v.date).toLocaleString()}
                  </td>
                  {/* <td className="p-3 border">{v.responsableNom || '—'}</td> */}
                  <td className="p-3 border">{v.remarques || '—'}</td>
                  <td className="p-3 border">
                    {new Date(v.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    {v.typeVisite || '—'} {/* 🆕 Affichage du type de visite */
                    }</td>

                  {getUser()?.role !== 'CLIENT' && (
                    <td className="p-3 border space-x-2">
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                        onClick={() => handleRemove(v.id)}
                      >
                        <FaTrash />
                      </button>
                      {/* <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                        onClick={() => toast.info('Clôture à implémenter')}
                      >
                        Clôturer
                      </button> */}
                    </td>)}
                  {getUser()?.role === 'CLIENT' && (
                    <td className="p-3 border">
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600"
                        onClick={() => navigate(`/${getUser()?.role.toLowerCase()}/visites/${v.id}`)}
                      >
                        <FaInfo />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
