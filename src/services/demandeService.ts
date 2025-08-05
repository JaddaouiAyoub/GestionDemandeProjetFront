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