import axios from '../utils/axios'

export const getMesDemandes = async () => {
  const res = await axios.get('/demandes/mes-demandes')
  return res.data.data
}

export const createDemande = async (formData: FormData) => {
  try {
    const response = await axios.post('/demandes', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getDemandesByType = async (type: string) => {
  const response = await axios.get(`/demandes/par-type/${type}`)
  return response.data // ou response.data.data selon ta structure
}

export const getDemandeById = async (id: number) => {
  const response = await axios.get(`/demandes/${id}`);
  return response.data.data; // car tu encapsules dans { success, data }
};

export const updateDemandeStatus = async (id: number, status: string, remarques?: string) => {
  const response = await axios.put(`/demandes/${id}/status`, {
    status,
    remarques
  });
  return response.data.data;
};

// src/services/demandeService.ts (ou dossierEtudeService.ts selon ton architecture)

export const updateDemandeDocuments = async (
  demandeId: string,
  formData: FormData
): Promise<any> => {
  try {
    return await axios.put(`/demandes/${demandeId}/documents`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  } catch (error) {
    console.error('Erreur lors de la mise à jour des documents :', error)
    throw error
  }
}
