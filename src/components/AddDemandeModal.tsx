import { useState } from 'react';
import { createDemande } from '../services/demandeService';

export default function AddDemandeModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    titre: '',
    ville: '',
    adresse: '',
    type: '',
    description: '',
    remarques: ''
  });

  const [documents, setDocuments] = useState<Record<string, File | null>>({
    cinOrPassport: null,
    lettreDemande: null,
    titrePropriete: null,
    permisConstruire: null,
    planSituation: null,
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e, key) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments((prev) => ({ ...prev, [key]: file }));
    }
  };

  const removeFile = (key) => {
    setDocuments((prev) => ({ ...prev, [key]: null }));
  };

  const renderPreview = (file) => {
    const url = URL.createObjectURL(file);
    if (file.type === 'application/pdf') {
      return <iframe src={url} title={file.name} className="w-24 h-32 border rounded" />;
    } else if (file.type.startsWith('image')) {
      return <img src={url} alt="preview" className="w-24 h-32 object-contain border rounded" />;
    } else {
      return <span className="text-xs">Fichier non pris en charge</span>;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    Object.entries(documents).forEach(([key, file]) => {
      if (file) data.append('documents', file);
    });

    try {
      let res = await createDemande(data);
      let newDemande = {
        ...res.data,
      }
      console.log('Demande créée avec succès:', res);
      onSuccess?.(newDemande);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la création de la demande');
    }
  };

  const docFields = [
    { key: 'cinOrPassport', label: 'CIN ou Passeport' },
    { key: 'lettreDemande', label: 'Lettre de demande' },
    { key: 'titrePropriete', label: 'Titre de propriété' },
    { key: 'permisConstruire', label: 'Permis de construire' },
    { key: 'planSituation', label: 'Plan de situation' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 ">
<div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-lg">✕</button>
        <h2 className="text-xl font-semibold mb-4">Ajouter une demande</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {['titre', 'ville', 'adresse'].map((field) => (
              <input
                key={field}
                type="text"
                name={field}
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                className="border p-2 rounded"
                value={formData[field]}
                onChange={handleInputChange}
                required
              />
            ))}

            <select
              name="type"
              className="border p-2 rounded cursor-pointer"
              value={formData.type}
              onChange={handleInputChange}
              required
            >
              <option value="" disabled>Sélectionnez un type</option>
              <option value="AEP">AEP</option>
              <option value="ASSEU">ASSEU</option>
              <option value="LES_DEUX">LES DEUX</option>
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            className="border p-2 rounded w-full"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />

          {/* <textarea
            name="remarques"
            placeholder="Remarques"
            className="border p-2 rounded w-full"
            value={formData.remarques}
            onChange={handleInputChange}
            rows={2}
          /> */}

          <label className="block font-medium">📄 Documents requis</label>
          <div className="flex flex-wrap gap-6 items-start">
            {docFields.map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm font-semibold block mb-1">{label}</label>
                {!documents[key] ? (
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, key)}
                    className="block text-sm"
                  />
                ) : (
                  <div className="relative w-fit group">
                    {renderPreview(documents[key])}
                    <button
                      type="button"
                      onClick={() => removeFile(key)}
                      className="absolute -top-2 -right-2 bg-white border rounded-full px-1 text-red-600 text-xs opacity-0 group-hover:opacity-100 transition"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
