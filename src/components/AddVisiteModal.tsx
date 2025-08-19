// src/components/AddVisiteModal.tsx
import { useEffect, useState } from 'react'
import { visiteService, NewVisitePayload, TypeDemande } from '../services/visiteService'
import { getDossiersByClient, getDossiersByType } from '../services/dossierExecutionService'
import { toast } from 'react-toastify'
import { getUser } from '../utils/auth'

interface Props {
  onClose: () => void
  onSuccess: (visite: any) => void
  typeDemande?: TypeDemande   // paramètre optionnel
}

export default function AddVisiteModal({ onClose, onSuccess, typeDemande }: Props) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 16))
  const [remarques, setRemarques] = useState('')
  const [dossierExecutionId, setDossierExecutionId] = useState<number | ''>('')
  const [documentFile, setDocumentFile] = useState<File | undefined>()
  const [loading, setLoading] = useState(false)
  const [dossiers, setDossiers] = useState<any>([])

  const [typeVisite, setTypeVisite] = useState<string>('') // 🆕 State pour type de visite

  // Charger les dossiers
  useEffect(() => {
    const fetchDossiers = async () => {
      try {
        let data
        if (typeDemande) {
          data = await getDossiersByType(typeDemande)
        } else {
          data = await getDossiersByClient()
        }
        setDossiers(data || [])
      } catch (err) {
        console.error(err)
        toast.error('Erreur lors du chargement des dossiers')
      }
    }
    fetchDossiers()
  }, [typeDemande])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const user = getUser()
    if (!user) {
      toast.error('Utilisateur non authentifié')
      return
    }
    if (!date || !dossierExecutionId || !typeVisite) { // 🆕 vérification
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    const payload: NewVisitePayload = {
      date: new Date(date).toISOString(),
      remarques,
      responsableId: Number(user.id),
      dossierExecutionId: Number(dossierExecutionId),
      documentFile,
      typeVisite, // 🆕 inclus dans le payload
    }

    try {
      setLoading(true)
      console.log('Création de la visite avec payload:', payload)
      const data = await visiteService.create(payload)
      toast.success('Visite ajoutée avec succès')
      onSuccess(data.data.data)
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors de la création de la visite')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">➕ Ajouter une Visite</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block mb-1 text-sm font-medium">Date de la visite *</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border rounded w-full p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Type de visite *</label> {/* 🆕 */}
            <select
              value={typeVisite}
              onChange={(e) => setTypeVisite(e.target.value)}
              className="border rounded w-full p-2"
              required
            >
              <option value="">-- Sélectionnez un type --</option>
              <option value="Essai de pression">Essai de pression</option>
              <option value="Essai d’écoulement">Essai d’écoulement</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Dossier d'exécution *</label>
            <select
              value={dossierExecutionId}
              onChange={(e) => setDossierExecutionId(Number(e.target.value))}
              className="border rounded w-full p-2 text-red-950"
              required
            >
              <option value="">-- Sélectionnez un dossier --</option>
              {dossiers.map((dossier) => (
                <option key={dossier.id} value={dossier.id}>
                  {dossier.demande.titre} - id : {dossier.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Avancements</label>
            <textarea
              value={remarques}
              onChange={(e) => setRemarques(e.target.value)}
              className="border rounded w-full p-2"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Document (optionnel)</label>
            <input
              type="file"
              onChange={(e) => setDocumentFile(e.target.files?.[0])}
              className="border rounded w-full p-2"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
