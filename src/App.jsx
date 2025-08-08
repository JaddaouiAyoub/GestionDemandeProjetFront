import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientLayout from './pages/client/ClientLayout'
import Home from './pages/client/ClientHome'
import MesDemandes from './pages/client/MesDemandes'
import DemandesPage from './components/DemandesPage'
import DemandeDetail from './components/DemandeDetail'

import ResAEPLayout from './pages/responsableAEP/ResAEPLayout'
import ResAEPHome from './pages/responsableAEP/ResAEPHome'
import ResASSEULayout from './pages/responsableASSEU/ResASSEULayout'
import ResASSEUHome from './pages/responsableASSEU/ResASSEUHome'
import ProtectedRoute from './guards/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import { isAuthenticated, getUser } from './utils/auth'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated() ? (
                <Navigate to={`/${getUser()?.role.toLowerCase()}/dashboard`} replace />
              ) : (
                <LoginPage />
              )
            }
          />
          {/* Route par défaut */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Dashboard protégé */}
          {/* <Route
            path="/client/dashboard"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <Dashboard />
              </ProtectedRoute>
            }
          /> */}

          {/* Routes protégées pour le CLIENT */}
          <Route
            path="/client"
            element={
              <ProtectedRoute requiredRole="CLIENT">
                <ClientLayout />
              </ProtectedRoute>
            }
          >
            {/* ✅ Redirection vers /client/home si on accède à /client */}
            <Route index element={<Navigate to="dashboard" />} />

            {/* Sous-routes */}
            <Route path="dashboard" element={<Home />} />
            <Route path="mes-demandes" element={<MesDemandes />} />
            {/* ...autres routes */}
          </Route>

          {/* Routes protégées pour le Responsable_aep */}
          <Route
            path="/responsable_aep"
            element={
              <ProtectedRoute requiredRole="RESPONSABLE_AEP">
                <ResAEPLayout />
              </ProtectedRoute>
            }
          >
            {/* ✅ Redirection vers /client/home si on accède à /client */}
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="demandes/:id" element={<DemandeDetail />} />
            {/* Sous-routes */}
            <Route path="dashboard" element={<ResAEPHome />} />
            <Route path="mes-demandes" element={<DemandesPage type="AEP" />} />
            {/* <Route path="mes-demandes" element={<MesDemandes />} /> */}
            {/* ...autres routes */}
          </Route>
          {/* Routes protégées pour le Responsable_aep */}
          <Route
            path="/responsable_asseu"
            element={
              <ProtectedRoute requiredRole="RESPONSABLE_ASSEU">
                <ResASSEULayout />
              </ProtectedRoute>
            }
          >
            {/* ✅ Redirection vers /client/home si on accède à /client */}
            <Route index element={<Navigate to="dashboard" />} />
            <Route path="demandes/:id" element={<DemandeDetail />} />
            {/* Sous-routes */}
            <Route path="dashboard" element={<ResASSEUHome />} />
            <Route path="mes-demandes" element={<DemandesPage type="ASSEU" />} />
            {/* <Route path="mes-demandes" element={<MesDemandes />} /> */}
            {/* ...autres routes */}
          </Route>

          {/* Non autorisé */}
          <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />

          {/* Toutes les autres routes → redirigées vers login */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
