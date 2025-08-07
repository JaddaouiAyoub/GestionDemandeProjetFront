// src/components/DemandeDetail.tsx
import { useEffect, useState } from 'react';
import { getDemandeById } from '../services/demandeService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateDemandeStatus } from '../services/demandeService';

const DemandeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [demande, setDemande] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [remarquesInput, setRemarquesInput] = useState('');


    useEffect(() => {
        const fetchDemande = async () => {
            try {
                setLoading(true);
                const data = await getDemandeById(Number(id));
                setDemande(data);
            } catch (err) {
                console.error(err);
                setError('Erreur lors du chargement de la demande.');
                toast.error('Erreur lors du chargement');
            } finally {
                setLoading(false);
            }
        };

        fetchDemande();
    }, [id]);

    const handleStatusChange = async (status: string, remarques?: string) => {
        try {
            const updated = await updateDemandeStatus(Number(id), status, remarques);
            toast.success('Statut mis à jour');
            setDemande(updated);
            setShowModal(false);
            setRemarquesInput('');
        } catch (err) {
            toast.error('Erreur lors de la mise à jour du statut');
            console.error(err);
        }
    };


    if (loading) return <div className="text-center mt-10">Chargement...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!demande) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Détails de la Demande</h2>

      <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
        <div className="space-y-2">
          <p><span className="font-semibold">Titre :</span> {demande.titre}</p>
          <p><span className="font-semibold">Ville :</span> {demande.ville}</p>
          <p><span className="font-semibold">Adresse :</span> {demande.adresse}</p>
          <p><span className="font-semibold">Type :</span> {demande.type}</p>
          <p><span className="font-semibold">Status :</span> {demande.status}</p>
          <p><span className="font-semibold">Remarques :</span> {demande.remarques || 'N/A'}</p>
        </div>
        <div className="space-y-2">
          <p className="font-semibold mb-2 ml-10">Client </p>
          <p><span className="font-semibold">Nom :</span> {demande.client.firstName} {demande.client.lastName}</p>
          <p><span className="font-semibold">Email :</span> {demande.client.email}</p>
          <p><span className="font-semibold">Téléphone :</span> {demande.client.phone}</p>
          <p><span className="font-semibold">Adresse :</span> {demande.client.address}</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Documents</h3>
        <div className="grid grid-cols-2 gap-6">
          {demande.documents.map((doc: any) => {
            const fileUrl = `http://127.0.0.1:3000/${doc.path}`;
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.filename);
            const isPdf = /\.pdf$/i.test(doc.filename);

            return (
              <div key={doc.id} className="border border-gray-200 p-4 rounded-lg shadow-sm bg-gray-50">
                <p className="font-semibold text-gray-800">{doc.filename}</p>

                {isImage ? (
                  <img
                    src={fileUrl}
                    alt={doc.filename}
                    className="w-full h-64 object-contain mt-2 rounded"
                  />
                ) : isPdf ? (
                  <iframe
                    src={fileUrl}
                    className="w-full h-64 mt-2 rounded"
                    title={doc.filename}
                  ></iframe>
                ) : (
                  <p className="text-red-500 mt-2">Type de fichier non supporté</p>
                )}

                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 mt-3 inline-block hover:underline text-sm"
                >
                  Voir en plein écran
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded text-white text-sm"
            onClick={() => handleStatusChange('ACCEPTEE')}
          >
            ✅ Accepter la demande
          </button>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded text-white text-sm"
            onClick={() => setShowModal(true)}
          >
            ⚠️ Document manquant / à modifier
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded text-white text-sm"
            onClick={() => handleStatusChange('EN_ETUDE')}
          >
            📘 Mettre en étude
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ajouter une remarque</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={4}
              value={remarquesInput}
              onChange={(e) => setRemarquesInput(e.target.value)}
              placeholder="Indiquez les documents manquants ou erreurs..."
            />
            <div className="flex justify-end gap-3">
              <button
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm"
                onClick={() => setShowModal(false)}
              >
                Annuler
              </button>
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm"
                onClick={() => handleStatusChange('A_CORRIGER', remarquesInput)}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  
    );
};

export default DemandeDetail;
