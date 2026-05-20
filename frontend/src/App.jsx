import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

// Pages - Public
import Home                 from './pages/Home'
import HomeAuth             from './pages/HomeAuth'
import Login                from './pages/Login'
import Register             from './pages/Register'
import RegisterVolunteer    from './pages/RegisterVolunteer'
import RegisterOrganization from './pages/RegisterOrganization'
import NotFound             from './pages/NotFound'

// Pages - Volunteer
import VolProfile      from './pages/volunteer/VolProfile'
import VolView         from './pages/volunteer/VolView'
import VolProjects     from './pages/volunteer/VolProjects'
import VolCertificates from './pages/volunteer/VolCertificates'

// Pages - Organization
import OrgProfile       from './pages/organization/OrgProfile'
import OrgPublic        from './pages/organization/OrgPublic'
import OrgProjects      from './pages/organization/OrgProjects'
import OrgVolunteers    from './pages/organization/OrgVolunteers'
import OrgDashboard     from './pages/organization/OrgDashboard'
import OrgPlans         from './pages/organization/OrgPlans'
import OrgAdvertisement from './pages/organization/OrgAdvertisement'

// Protected route wrappers
function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginTop: 12, color: 'var(--text-2)' }}>Cargando...</p>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function PlanRoute({ children, minPlan }) {
  const { user } = useAuth()
  const planId   = user?.profile?.plan_id || 1
  if (planId < minPlan) return <Navigate to="/organizacion/planes" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <HomeAuth /> : <Home />} />
      <Route path="/login"    element={user ? <Navigate to={user.role === 'volunteer' ? '/voluntario/perfil' : '/organizacion/perfil'} /> : <Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/registro/voluntario"    element={<RegisterVolunteer />} />
      <Route path="/registro/organizacion"  element={<RegisterOrganization />} />

      {/* Volunteer */}
      <Route path="/voluntario" element={<Navigate to="/voluntario/perfil" />} />
      <Route path="/voluntario/perfil"
        element={<PrivateRoute role="volunteer"><VolProfile /></PrivateRoute>} />
      <Route path="/voluntario/:id"
        element={<PrivateRoute role="organization"><VolView /></PrivateRoute>} />
      <Route path="/voluntario/proyectos"
        element={<PrivateRoute role="volunteer"><VolProjects /></PrivateRoute>} />
      <Route path="/voluntario/certificados"
        element={<PrivateRoute role="volunteer"><VolCertificates /></PrivateRoute>} />

      {/* Organization */}
      <Route path="/organizacion" element={<Navigate to="/organizacion/perfil" />} />
      <Route path="/organizacion/:id" element={<OrgPublic />} />
      <Route path="/organizacion/perfil"
        element={<PrivateRoute role="organization"><OrgProfile /></PrivateRoute>} />
      <Route path="/organizacion/proyectos"
        element={<PrivateRoute role="organization"><OrgProjects /></PrivateRoute>} />
      <Route path="/organizacion/voluntarios"
        element={<PrivateRoute role="organization"><PlanRoute minPlan={2}><OrgVolunteers /></PlanRoute></PrivateRoute>} />
      <Route path="/organizacion/dashboard"
        element={<PrivateRoute role="organization"><PlanRoute minPlan={3}><OrgDashboard /></PlanRoute></PrivateRoute>} />
      <Route path="/organizacion/publicidad"
        element={<PrivateRoute role="organization"><PlanRoute minPlan={4}><OrgAdvertisement /></PlanRoute></PrivateRoute>} />
      <Route path="/organizacion/planes"
        element={<PrivateRoute role="organization"><OrgPlans /></PrivateRoute>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--card)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#00D4A3', secondary: '#fff' } },
              error:   { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
