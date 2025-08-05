// src/guards/ProtectedRoute.tsx
import React, { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { isAuthenticated, hasRole } from '../utils/auth'

interface Props {
  children: JSX.Element
  requiredRole?: string
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  if (!isAuthenticated()) return <Navigate to="/login" />

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" />
  }

  return children
}
