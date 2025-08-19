import { useEffect, useState } from 'react'
import { getMesDemandes } from '../../services/demandeService'
import { toast } from 'react-toastify'
import AddDemandeModal from '../../components/AddDemandeModal'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../utils/auth'

interface Demande {
    id: number
    titre: string
    ville: string
    adresse: string
    type: string
    createdAt: string
    status?: string
}

export default function MesDemandes() {
    const [demandes, setDemandes] = useState<Demande[]>([])
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false);
    const navigate = useNavigate()

    const handleModalSuccess = (newDemande: Demande) => {
        // console.log('Demande ajoutée:', newDemande);
        // console.log('Demandes avant ajout:', demandes);
        // console.log('Demandes après ajout:', [...demandes, newDemande]);
        // setDemandes([newDemande, ...demandes])
        toast.success('Demande créée avec succès veuillez ajouter les documents nécessaires')
        navigate(`/${getUser()?.role.toLowerCase()}/mes-demandes/${newDemande.id}`)
        // Refresh list or toast
        // console.log('Demande créée avec succès');
    };
    useEffect(() => {
        const fetchDemandes = async () => {
            try {
                const data = await getMesDemandes()
                setDemandes(data)
            } catch (err) {
                console.error(err)
                toast.error('Erreur lors de la récupération des demandes')
            } finally {
                setLoading(false)
            }
        }

        fetchDemandes()
    }, [])

    if (loading) return <div className="text-center">Chargement...</div>

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 Mes Demandes</h2>

                <button
                    onClick={() => setOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    +
                </button>
            </div>


            {open && (
                <AddDemandeModal onClose={() => setOpen(false)} onSuccess={handleModalSuccess} />
            )}
            {demandes.length === 0 ? (
                <p className="text-gray-600">Aucune demande pour le moment.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm border">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3 border">Titre</th>
                                <th className="p-3 border">Type</th>
                                <th className="p-3 border">Adresse</th>
                                <th className="p-3 border">Ville</th>
                                <th className="p-3 border">Créée le</th>
                                <th className="p-3 border">Status</th>
                                <th className="p-3 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {demandes.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="p-3 border">{d.titre}</td>
                                    <td className="p-3 border">{d.type}</td>
                                    <td className="p-3 border">{d.adresse}</td>
                                    <td className="p-3 border">{d.ville}</td>
                                    <td className="p-3 border">{new Date(d.createdAt).toLocaleDateString()}</td>
                                    <td className="p-3 border">{d.status}</td>
                                    <td className="p-3 border">
                                        <button
                                            onClick={() => navigate(`/${getUser()?.role.toLowerCase()}/mes-demandes/${d.id}`)}
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
            )}
        </div>
    )
}
