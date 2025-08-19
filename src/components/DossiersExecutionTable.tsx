import React, { useEffect, useState } from 'react'
import { getDossierById, getDossiersByType, updateDossierStatus } from '../services/dossierExecutionService'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getUser } from '../utils/auth'

interface Dossier {
  id: number
  createdAt: string
  status: string
  remarques?: string
  demande: {
    titre: string
    type: string
  }
}

const DossiersTable: React.FC<{ type: 'AEP' | 'ASSEU' | 'LES_DEUX'  }> = ({ type }) => {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const canChangeStatus = (status: string ,dossier:Dossier) => {
    const userRole = getUser()?.role
    return (userRole === 'RESPONSABLE_AEP' && status === 'EN_COURS') ||
           (userRole === 'RESPONSABLE_ASSEU' && status === 'EN_COURS') ||
           (getUser()?.role === "RESPONSABLE_AEP" && String(dossier.status) !== "ACCEPTEE_AEP") ||
           (getUser()?.role === "RESPONSABLE_ASSEU" && String(dossier.status) !== "ACCEPTEE_ASSEU")
    }
  const handleStatusChange = async (id:Number,status: string, remarques?: string) => {
          try {
              await updateDossierStatus(Number(id), status, remarques);
              toast.success("Statut mis à jour");
              const updated = await getDossierById(Number(id));
              setDossiers(dossiers.map(d => d.id === id ? updated : d));
              // setDossier(updated);
              // setShowModal(false);
              // setRemarquesInput('');
              
          } catch (err) {
              toast.error("Erreur lors de la mise à jour du statut");
              console.error(err);
          }
      };
  
  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        const data = await getDossiersByType(type)
        setDossiers(data)
        console.log('Dossiers récupérés:', data)
      } catch (error) {
        console.error(error)
        toast.error('Erreur lors du chargement des dossiers')
        setError('Impossible de récupérer les dossiers.')
      } finally {
        setLoading(false)
      }
    }

    fetchDossiers()
  }, [type])

  if (loading) return <div className="text-center">Chargement...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📂 Dossiers d'Éxecution — {type}</h2>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-sm">
            <th className="border border-gray-300 px-4 py-2">Titre de la Demande</th>
            <th className="border border-gray-300 px-4 py-2">Type</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {dossiers.map((dossier) => (
            <tr key={dossier.id} className="text-center text-sm">
              <td className="border px-4 py-2">{dossier.demande.titre}</td>
              <td className="border px-4 py-2">{dossier.demande.type}</td>
              <td className="border px-4 py-2">{dossier.status}</td>
              <td className="border px-4 py-2">
                {new Date(dossier.createdAt).toLocaleDateString()}
              </td>
              <td className="border px-4 py-2">
                <button
                  onClick={() =>
                    navigate(`/${getUser()?.role.toLowerCase()}/dossiersExecution/${dossier.id}`)
                  }
                  className="bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Détails
                </button>
                <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded text-sm hover:bg-yellow-600 disabled:opacity-50"
                        onClick={() => handleStatusChange(dossier.id, 'ACCEPTEE')}
                        disabled={!canChangeStatus(dossier.status, dossier)}
                      >
                        Clôturer
                      </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DossiersTable
