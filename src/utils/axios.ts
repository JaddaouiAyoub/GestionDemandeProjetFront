// src/utils/axios.ts
import axios from 'axios'
import { toast } from 'react-toastify'
import { logout } from '../services/authService'
const instance = axios.create({
  baseURL: 'http://localhost:3000/api', // adapte à ton backend
})

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Une erreur est survenue'
    
    if (err.response?.status === 401) {
        logout()
      toast.error('Session expirée ou non autorisé')
    } else {
        logout()
        toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default instance
