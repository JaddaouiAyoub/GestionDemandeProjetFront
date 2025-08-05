// src/utils/auth.ts
import {jwtDecode} from 'jwt-decode'

interface DecodedToken {
  id: string
  role: string
  exp: number
}

export const getUser = (): DecodedToken | null => {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    return jwtDecode(token)
  } catch {
    return null
  }
}

export const isAuthenticated = () => !!getUser()

export const hasRole = (role: string) => {
  const user = getUser()
  return user?.role === role
}
