import axios from '../utils/axios'

export const getDossiersByClient = async () => {
  const res = await axios.get('/dossierEtude/client')
  return res.data.data
}

export const getDossiersByType = async (type: 'AEP' | 'ASSEU' | 'LES_DEUX') => {
  const res = await axios.get(`/dossierEtude/by-type/${type}`)
  return res.data.data
}

export const getDossierById = async (id: number | string) => {
  const res = await axios.get(`/dossierEtude/${id}`)
  return res.data.data
}

export const updateDossierStatus = async (
  id: number | string,
  status: string | 'EN_COURS' | 'ACCEPTEE' | 'A_CORRIGER',
  remarques?: string
) => {
  const res = await axios.put(`/dossierEtude/${id}/status`, {
    status,
    remarques
  })
  return res.data.data
}

export const addDocumentsToDossier = async (
  id: number | string,
  files: File[]
) => {
  const formData = new FormData()
  files.forEach(file => {
    formData.append('documents', file)
  })

  const res = await axios.put(`/dossierEtude/${id}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })

  return res.data.data
}
