import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientLayout from './pages/client/ClientLayout'
import Home from './pages/client/ClientHome'
import MesDossiers from './pages/client/MesDossiers'
import MesDemandes from './pages/client/MesDemandes'
import DemandesPage from './components/DemandesPage'
import DemandeDetail from './components/DemandeDetail'
import DossiersTable from './components/DossiersTable'
import DossierEtudeDetail from './components/DossierDetail'
import DossiersExecutionTable from './components/DossiersExecutionTable'
import DossierExecutionDetail from './components/DossierExecutionDetail'

import ResAEPLayout from './pages/responsableAEP/ResAEPLayout'
import ResAEPHome from './pages/responsableAEP/ResAEPHome'
import ResASSEULayout from './pages/responsableASSEU/ResASSEULayout'
import ResASSEUHome from './pages/responsableASSEU/ResASSEUHome'
import DirecteurHome from './pages/directeur/DirecteurHome'
import ProtectedRoute from './guards/ProtectedRoute'
import { ToastContainer } from 'react-toastify'
import { isAuthenticated, getUser } from './utils/auth'
import 'react-toastify/dist/ReactToastify.css'
import MesDossiersExecution from './pages/client/MesDossiersExexution'
import UsersPage from './pages/directeur/UsersPage'
import DirecteurLayout from './pages/directeur/DirecteurLayout'

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
            <Route path="mes-demandes/:id" element={<DemandeDetail />} />
            <Route path="dossiers/:id" element={<DossierEtudeDetail />} />
            <Route path="mes-dossiers" element={<MesDossiers type="LES_DEUX" />} />
            <Route path="dossiersExecution/:id" element={<DossierExecutionDetail />} />
            <Route path="dossiersExecution" element={<MesDossiersExecution type="LES_DEUX" />} />
            {/* ...autres routes */}
          </Route>

          <Route
            path="/directeur"
            element={
              <ProtectedRoute requiredRole="DIRECTEUR">
                <DirecteurLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" />} />

            {/* Sous-routes */}
            <Route path="dashboard" element={<DirecteurHome />} />
            <Route path="utilisateurs" element={<UsersPage />} />
            {/* <Route path="mes-demandes/:id" element={<DemandeDetail />} />
            <Route path="dossiers/:id" element={<DossierEtudeDetail />} />
            <Route path="mes-dossiers" element={<MesDossiers type="LES_DEUX" />} />
            <Route path="dossiersExecution/:id" element={<DossierExecutionDetail />} />
            <Route path="dossiersExecution" element={<MesDossiersExecution type="LES_DEUX" />} /> */}
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
            <Route path="dossiers" element={<DossiersTable type="AEP" />} />
            <Route path="dossiers/:id" element={<DossierEtudeDetail />} />
            <Route path="dossiersExecution" element={<DossiersExecutionTable type="AEP" />} />
            <Route path="dossiersExecution/:id" element={<DossierExecutionDetail />} />

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
            <Route path="dossiers" element={<DossiersTable type="ASSEU" />} />
            <Route path="dossiers/:id" element={<DossierEtudeDetail />} />
            <Route path="dossiersExecution" element={<DossiersExecutionTable type="ASSEU" />} />
            <Route path="dossiersExecution/:id" element={<DossierExecutionDetail />} />

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
