// src/components/DemandeDetail.tsx
import { useEffect, useState } from 'react';
import { getDemandeById } from '../services/demandeService';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const DemandeDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [demande, setDemande] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    if (loading) return <div className="text-center mt-10">Chargement...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!demande) return null;

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold mb-4">Détails de la Demande</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p><span className="font-semibold">Titre :</span> {demande.titre}</p>
                    <p><span className="font-semibold">Ville :</span> {demande.ville}</p>
                    <p><span className="font-semibold">Adresse :</span> {demande.adresse}</p>
                    <p><span className="font-semibold">Type :</span> {demande.type}</p>
                    <p><span className="font-semibold">Status :</span> {demande.status}</p>
                    <p><span className="font-semibold">Remarques :</span> {demande.remarques || 'N/A'}</p>
                </div>
                <div>
                    <p className="font-semibold mb-2">Client :</p>
                    <p><span className="font-semibold">Nom :</span> {demande.client.firstName} {demande.client.lastName}</p>
                    <p><span className="font-semibold">Email :</span> {demande.client.email}</p>
                    <p><span className="font-semibold">Téléphone :</span> {demande.client.phone}</p>
                    <p><span className="font-semibold">Adresse :</span> {demande.client.address}</p>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-xl font-semibold mb-2">Documents</h3>
                <div className="grid grid-cols-2 gap-6">
                    {demande.documents.map((doc: any) => {
                        const fileUrl = `http://127.0.0.1:3000/${doc.path}`;
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.filename);
                        const isPdf = /\.pdf$/i.test(doc.filename);

                        return (
                            <div key={doc.id} className="border p-3 rounded shadow-sm bg-gray-50">
                                <p className="font-semibold">{doc.filename}</p>

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
                                    className="text-blue-600 mt-2 inline-block hover:underline"
                                >
                                    Voir en plein écran
                                </a>
                            </div>
                        );
                    })}
                </div>

            </div>
        </div>
    );
};

export default DemandeDetail;
