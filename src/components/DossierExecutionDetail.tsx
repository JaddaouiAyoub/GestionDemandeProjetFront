import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addDocumentsToDossier, getDossierById, updateDossierStatus } from '../services/dossierExecutionService';
import { getUser } from '../utils/auth';

const documentLabels = ["Attestation IGT", "Bordereau des prix", "Convention laboratoire", "Mémoire Technique", "Plan d'implantation"];

const DossierExecutionDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [dossier, setDossier] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [remarquesInput, setRemarquesInput] = useState('');

    const user = getUser();
    const role = user?.role;

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

    const [files, setFiles] = useState<(File | null)[]>(Array(documentLabels.length).fill(null));

    const handleFileChange = (index: number, file: File | null) => {
        const updatedFiles = [...files];
        updatedFiles[index] = file;
        setFiles(updatedFiles);
    };

    const handleSave = async () => {
        if (!id) {
            toast.error("ID de dossier introuvable.");
            return;
        }

        const filesToSend = files
            .map((file, index) => file ? { file, label: documentLabels[index] } : null)
            .filter((item): item is { file: File, label: string } => item !== null);

        if (filesToSend.length === 0) {
            toast.warning("Aucun fichier sélectionné.");
            return;
        }

        try {
            await addDocumentsToDossier(id, filesToSend);
            toast.success("Documents enregistrés avec succès.");
        } catch (error) {
            toast.error("Erreur lors de l'enregistrement des documents.");
            console.error(error);
        }
    };


    const renderPreviewFromUrl = (doc: any) => {
        const fileUrl = `http://127.0.0.1:3000/${doc.path}`;
        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.filename);
        const isPdf = /\.pdf$/i.test(doc.filename);

        if (isImage) {
            return <img src={fileUrl} alt={doc.filename} className="h-full w-auto object-contain" />;
        } else if (isPdf) {
            return <iframe src={fileUrl} className="h-full w-full" title={doc.filename}></iframe>;
        } else {
            return <div className="text-gray-500">Type de fichier non supporté</div>;
        }
    };

    const renderPreview = (file: File | null) => {
        if (!file) return null;

        const url = URL.createObjectURL(file);
        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            return <img src={url} alt="preview" className="h-full w-auto object-contain" />;
        } else if (fileType === 'application/pdf') {
            return <iframe src={url} className="h-full w-full" title="pdf-preview" />;
        } else {
            return <div className="text-gray-500">Type de fichier non supporté</div>;
        }
    };

    if (loading) return <div className="text-center mt-10">Chargement...</div>;
    if (error) return <div className="text-center mt-10 text-red-600">{error}</div>;
    if (!dossier) return null;

    const demande = dossier.demande;
    const client = dossier.client;
    const isAccepted = dossier.status === 'ACCEPTEE';

    // Map des documents par label (s'ils existent)
    const documentMap = dossier.documents?.reduce((acc: any, doc: any) => {
        acc[doc.label] = doc;
        return acc;
    }, {}) || {};

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">📁 Détails du Dossier d'Éxécution</h2>

            {/* Infos générales */}
            <div className="grid grid-cols-2 gap-6 text-sm text-gray-700 mb-10">
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg mb-2">📌 Dossier</h3>
                    <p><span className="font-semibold">Statut :</span> {dossier.status}</p>
                    <p><span className="font-semibold">Remarques :</span> {dossier.remarques || 'N/A'}</p>
                    <p><span className="font-semibold">Date de création :</span> {new Date(dossier.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg mb-2">📝 Demande</h3>
                    <p><span className="font-semibold">Titre :</span> {demande.titre}</p>
                    <p><span className="font-semibold">Type :</span> {demande.type}</p>
                    <p><span className="font-semibold">Statut :</span> {demande.status}</p>
                </div>
            </div>

            {/* Infos client */}
            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">👤 Informations du Client</h3>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                    <p><span className="font-semibold">Nom :</span> {client.firstName} {client.lastName}</p>
                    <p><span className="font-semibold">Email :</span> {client.email}</p>
                    <p><span className="font-semibold">Téléphone :</span> {client.phone}</p>
                    <p><span className="font-semibold">Adresse :</span> {client.address}</p>
                </div>
            </div>

            {/* Documents */}
            <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📎 Documents</h3>

                <div className="grid md:grid-cols-2 gap-6">
                    {documentLabels.map((label, index) => {
                        const existingDoc = documentMap[label];

                        return (
                            <div key={index} className="flex flex-col space-y-2">
                                <label className="font-medium text-sm text-gray-700">{label}</label>
                                {role === 'CLIENT' && (
                                    <input
                                        type="file"
                                        accept="application/pdf,image/*"
                                        onChange={(e) => handleFileChange(index, e.target.files?.[0] || null)}
                                        className="border rounded p-2"
                                    />
                                )}

                                <div className="h-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                                    {files[index]
                                        ? renderPreview(files[index])
                                        : existingDoc
                                            ? renderPreviewFromUrl(existingDoc)
                                            : <span className="text-gray-400">Prévisualisation {label}</span>}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {role === 'CLIENT' && (
                    <button
                        onClick={handleSave}
                        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition disabled:opacity-50"
                        disabled={isAccepted}
                    >
                        Enregistrer
                    </button>
                )}
            </div>

            {/* Actions */}
            {role !== 'CLIENT' && (
                <div className="mt-10">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">⚙️ Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button
                            className="bg-green-600 hover:bg-green-700 transition px-5 py-2 rounded text-white text-sm disabled:opacity-50"
                            onClick={() => handleStatusChange('ACCEPTEE')}
                            disabled={isAccepted}
                        >
                            ✅ Accepter le dossier
                        </button>

                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 transition px-5 py-2 rounded text-white text-sm disabled:opacity-50"
                            onClick={() => setShowModal(true)}
                            disabled={isAccepted}
                        >
                            ⚠️ Demande à corriger
                        </button>
                    </div>
                </div>
            )}

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

export default DossierExecutionDetail;
