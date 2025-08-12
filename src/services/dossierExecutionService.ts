import axios from '../utils/axios'

export const getDossiersByClient = async () => {
  const res = await axios.get('/dossierExecution/client')
  return res.data.data
}

export const getDossiersByType = async (type: 'AEP' | 'ASSEU' | 'LES_DEUX') => {
  const res = await axios.get(`/dossierExecution/by-type/${type}`)
  return res.data.data
}

export const getDossierById = async (id: number | string) => {
  const res = await axios.get(`/dossierExecution/${id}`)
  return res.data.data
}

export const updateDossierStatus = async (
  id: number | string,
  status: string | 'EN_COURS' | 'ACCEPTEE' | 'A_CORRIGER',
  remarques?: string
) => {
  const res = await axios.put(`/dossierExecution/${id}/status`, {
    status,
    remarques
  })
  return res.data.data
}

export const addDocumentsToDossier = async (
  id: number | string,
  filesWithLabels: { file: File, label: string }[]
) => {
  const formData = new FormData();

  filesWithLabels.forEach(({ file, label }) => {
    formData.append('documents', file);
    formData.append('labels', label); // envoyer le label correspondant
  });

  const res = await axios.put(`/dossierExecution/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return res.data.data;
};
