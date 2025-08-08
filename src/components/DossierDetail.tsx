import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getDossierById, updateDossierStatus } from '../services/dossierEtudeService';

const DossierEtudeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [dossier, setDossier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [remarquesInput, setRemarquesInput] = useState('');

  useEffect(() => {
    const fetchDossier = async () => {
      try {
        setLoading(true);
        const data = await getDossierById(Number(id));
        setDossier(data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement du dossier.");
        toast.error("Erreur lors du chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchDossier();
  }, [id]);

  const handleStatusChange = async (status: string, remarques?: string) => {
    try {
      await updateDossierStatus(Number(id), status, remarques);
      toast.success("Statut mis à jour");
      const updated = await getDossierById(Number(id));
      setDossier(updated);
      setShowModal(false);
      setRemarquesInput('');
    } catch (err) {
      toast.error("Erreur lors de la mise à jour du statut");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Chargement...</div>;
  if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
  if (!dossier) return null;

  const { demande, client } = dossier;

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800">🗂️ Détails du Dossier d'Étude</h2>

      <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-700">
        {/* Infos Dossier */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📄 Informations du Dossier</h3>
          <p><span className="font-semibold">Statut :</span> {dossier.status}</p>
          <p><span className="font-semibold">Remarques :</span> {dossier.remarques || 'N/A'}</p>
          <p><span className="font-semibold">Créé le :</span> {new Date(dossier.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Infos Demande */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">📝 Détails de la Demande</h3>
          <p><span className="font-semibold">Titre :</span> {demande?.titre}</p>
          <p><span className="font-semibold">Type :</span> {demande?.type}</p>
          <p><span className="font-semibold">Statut :</span> {demande?.status}</p>
          <p><span className="font-semibold">Adresse :</span> {demande?.adresse}</p>
          <p><span className="font-semibold">Ville :</span> {demande?.ville}</p>
          <p><span className="font-semibold">Description :</span> {demande?.description}</p>
        </div>
      </div>

      {/* Infos Client */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">👤 Informations du Client</h3>
        <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
          <p><span className="font-semibold">Nom :</span> {client?.firstName} {client?.lastName}</p>
          <p><span className="font-semibold">Email :</span> {client?.email}</p>
          <p><span className="font-semibold">Téléphone :</span> {client?.phone}</p>
          <p><span className="font-semibold">Adresse :</span> {client?.address}</p>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📎 Documents</h3>
        {dossier.documents?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {dossier.documents.map((doc: any) => {
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
        ) : (
          <p className="text-gray-500">Aucun document disponible.</p>
        )}
      </div>

      {/* Actions */}
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">⚙️ Actions</h3>
        <div className="flex flex-wrap gap-4">
          <button
            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded text-white text-sm"
            onClick={() => handleStatusChange('ACCEPTEE')}
          >
            ✅ Accepter le dossier
          </button>

          <button
            className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded text-white text-sm"
            onClick={() => setShowModal(true)}
          >
            ⚠️ Demande à corriger
          </button>
        </div>
      </div>

      {/* Modal remarques */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Ajouter une remarque</h3>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
              rows={4}
              value={remarquesInput}
              onChange={(e) => setRemarquesInput(e.target.value)}
              placeholder="Indiquez les remarques pour correction..."
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

export default DossierEtudeDetail;
