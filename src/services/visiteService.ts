// src/services/visiteService.ts
import api from '../utils/axios'

export type TypeDemande = 'AEP' | 'ASSEU' | 'LES_DEUX'

export interface NewVisitePayload {
  date: string;                 // ISO: "2025-08-15T10:30:00.000Z"
  remarques?: string;
  responsableId: number;        // user.id du responsable
  dossierExecutionId: number;   // dossier d'exécution concerné
  typeVisite?: string;          // optionnel, pour spécifier le type de visite
  documentFile?: File;          // optionnel (champ: "document")
}

export interface UpdateVisitePayload {
  date?: string;
  remarques?: string;
  responsableId?: number;
  dossierExecutionId?: number;
}

export const visiteService = {
  /** Récupérer les visites par type de demande (AEP, ASSEU, LES_DEUX) */
  getByType: (type: TypeDemande) => api.get(`/visites/by-type/${type}`),

  /** Récupérer les visites par client */
  getByClient: (clientId: number) => api.get(`/visites/by-client/${clientId}`),

  /** Créer une visite (multipart si document fourni) */
  create: (payload: NewVisitePayload) => {
    const formData = new FormData()
    formData.append('date', payload.date)
    formData.append('responsableId', String(payload.responsableId))
    formData.append('dossierExecutionId', String(payload.dossierExecutionId))
    formData.append('typeVisite',String(payload.typeVisite))
    if (payload.remarques) formData.append('remarques', payload.remarques)
    if (payload.documentFile) formData.append('document', payload.documentFile)

    return api.post('/visites', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  async getById(id: number) {
    return api.get(`/visites/details/${id}`)
  },
  /** Mettre à jour une visite (JSON, pas de fichier ici) */
  update: (id: number, data: UpdateVisitePayload) =>
    api.put(`/visites/${id}`, data),

  /** Supprimer une visite */
  remove: (id: number) => api.delete(`/visites/${id}`),
}
