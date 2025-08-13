import api from '../utils/axios'

export interface User {
  id?: number
  firstName: string
  lastName: string
  email: string
  password?: string
  role: 'CLIENT' | 'RESPONSABLE_AEP' | 'RESPONSABLE_ASSEU' | 'DIRECTEUR'
  phone?: string
  address?: string
  createdAt?: string
}

// 📌 Créer un utilisateur
export const createUser = async (userData: User) => {
  const res = await api.post('/users', userData)
  return res.data
}

// 📌 Récupérer tous les utilisateurs
export const getAllUsers = async () => {
  const res = await api.get<User[]>('/users')
  return res.data
}

// 📌 Récupérer un utilisateur par ID
export const getUserById = async (id: number) => {
  const res = await api.get<User>(`/users/${id}`)
  return res.data
}

// 📌 Mettre à jour un utilisateur
export const updateUser = async (id: number, userData: Partial<User>) => {
  const res = await api.put(`/users/${id}`, userData)
  return res.data
}

// 📌 Supprimer un utilisateur
export const deleteUser = async (id: number) => {
  const res = await api.delete(`/users/${id}`)
  return res.data
}
