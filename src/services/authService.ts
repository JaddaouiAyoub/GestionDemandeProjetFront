// src/services/authService.ts
import axios from '../utils/axios'
import { NavigateFunction, useNavigate } from 'react-router-dom';

export const login = async (email: string, password: string) => {
  const response = await axios.post('/auth/login', { email, password })
  const token = response.data.token
  localStorage.setItem('token', token)
  return token
}

export const register = async (data: any) => {
  return axios.post('/auth/register', data)
}

export const logout = () => {
  localStorage.removeItem('token')
  window.location.href = '/login' // ✅ redirection sans React Router
}

export const getToken = () => {
  return localStorage.getItem('token')
}
