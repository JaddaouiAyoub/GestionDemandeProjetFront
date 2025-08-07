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
