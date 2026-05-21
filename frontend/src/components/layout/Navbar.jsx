import { Link, useLocation } from 'react-router-dom'
import { FiSun, FiMoon, FiMenu, FiX, FiUser, FiBriefcase, FiAward, FiUsers, FiBarChart2, FiStar, FiHome } from 'react-icons/fi'
import { FaBullhorn } from 'react-icons/fa'
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import NotificationCenter from '../common/NotificationCenter'
import styles from './Navbar.module.css'
import logo from '../../assets/logo.png'

export default function Navbar() {
  const { theme, toggle } = useTheme()
  const { user, logout }  = useAuth()
  const [menu, setMenu]   = useState(false)
  const location = useLocation()

  const showInicio = user && user.role === 'volunteer' && location.pathname.startsWith('/voluntario')

  const dashboard = user?.role === 'volunteer' ? '/voluntario' : '/organizacion'

  // Build mobile nav links similar to Sidebar so mobile users can navigate when logged in
  const plan = user?.profile?.plan_id || 1
  const ORG_LINKS_BASE = [
    { to: '/organizacion/perfil',    icon: FiUser,      label: 'Perfil' },
    { to: '/organizacion/proyectos', icon: FiBriefcase, label: 'Proyectos' },
  ]
  const VOL_LINKS = [
    { to: '/',                       icon: FiHome,      label: 'Inicio' },
    { to: '/voluntario/perfil',       icon: FiUser,      label: 'Perfil' },
    { to: '/voluntario/proyectos',    icon: FiBriefcase, label: 'Proyectos' },
    { to: '/voluntario/certificados', icon: FiAward,     label: 'Certificados' },
  ]

  const orgLinks = [
    ...ORG_LINKS_BASE,
    ...(plan >= 2 ? [{ to: '/organizacion/voluntarios', icon: FiUsers, label: 'Voluntarios' }] : []),
    ...(plan >= 3 ? [{ to: '/organizacion/dashboard',   icon: FiBarChart2, label: 'Dashboard' }]  : []),
    ...(plan >= 4 ? [{ to: '/organizacion/publicidad',  icon: FaBullhorn, label: 'Publicidad' }] : []),
    { to: '/organizacion/planes', icon: FiStar, label: 'Planes' },
  ]

  const mobileLinks = user ? (user.role === 'volunteer' ? VOL_LINKS : orgLinks) : []

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* Logo + wordmark */}
        <Link to="/" className={styles.logo}>
          <img src={logo} alt="VolDigital" className={styles.logoImg} />
          <span className={styles.logoText}>Vol<strong>Digital</strong></span>
        </Link>

        {/* Desktop actions */}
        <div className={styles.actions}>
          <button className={styles.themeBtn} onClick={toggle} title="Cambiar tema">
            {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          {user ? (
            <>
              {showInicio && <Link to="/" className="btn btn-outline btn-sm">Inicio</Link>}
              <NotificationCenter />
              <Link to={dashboard} className="btn btn-primary btn-sm">Mi espacio</Link>
              <button className="btn btn-ghost btn-sm" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline btn-sm">Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary btn-sm">Registrarse</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className={styles.hamburger} onClick={() => setMenu(m => !m)}>
          {menu ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menu && (
        <div className={styles.mobileMenu}>
          <button className={styles.themeBtn} onClick={toggle}>
            {theme === 'light' ? <><FiMoon size={16}/> Modo oscuro</> : <><FiSun size={16}/> Modo claro</>}
          </button>

          {user && mobileLinks.length > 0 && (
            <div className={styles.mobileNav}>
              {mobileLinks.map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={styles.mobileLink} onClick={() => setMenu(false)}>
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          )}
          {user ? (
            <>
              {showInicio && <Link to="/" className="btn btn-outline" onClick={() => setMenu(false)}>Inicio</Link>}
              <Link to={dashboard} className="btn btn-primary" onClick={() => setMenu(false)}>Mi espacio</Link>
              <button className="btn btn-ghost" onClick={() => { logout(); setMenu(false) }}>Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn btn-outline" onClick={() => setMenu(false)}>Iniciar sesión</Link>
              <Link to="/registro" className="btn btn-primary" onClick={() => setMenu(false)}>Registrarse</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
