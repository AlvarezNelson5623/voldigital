import { NavLink, useNavigate } from 'react-router-dom'
import { FiUser, FiBriefcase, FiAward, FiUsers, FiBarChart2,
         FiSun, FiMoon, FiLogOut, FiStar, FiHome } from 'react-icons/fi'
import { FaBullhorn } from 'react-icons/fa'
import { useAuth }  from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationCenter from '../common/NotificationCenter'
import styles from './Sidebar.module.css'
import logo from '../../assets/logo.png'

const VOL_LINKS = [
  { to: '/',                       icon: FiHome,      label: 'Inicio' },
  { to: '/voluntario/perfil',       icon: FiUser,      label: 'Perfil' },
  { to: '/voluntario/proyectos',    icon: FiBriefcase, label: 'Proyectos' },
  { to: '/voluntario/certificados', icon: FiAward,     label: 'Certificados' },
]

const ORG_LINKS_BASE = [
  { to: '/organizacion/perfil',    icon: FiUser,      label: 'Perfil' },
  { to: '/organizacion/proyectos', icon: FiBriefcase, label: 'Proyectos' },
]

export default function Sidebar() {
  const { user, logout }  = useAuth()
  const { theme, toggle } = useTheme()
  const navigate          = useNavigate()

  const plan = user?.profile?.plan_id || 1

  const orgLinks = [
    ...ORG_LINKS_BASE,
    ...(plan >= 2 ? [{ to: '/organizacion/voluntarios', icon: FiUsers, label: 'Voluntarios' }] : []),
    ...(plan >= 3 ? [{ to: '/organizacion/dashboard',   icon: FiBarChart2, label: 'Dashboard' }]  : []),
    ...(plan >= 4 ? [{ to: '/organizacion/publicidad',  icon: FaBullhorn, label: 'Publicidad' }] : []),
    { to: '/organizacion/planes', icon: FiStar, label: 'Planes' },
  ]

  const links = user?.role === 'volunteer' ? VOL_LINKS : orgLinks
  const profileName = user?.role === 'volunteer'
    ? `${user.profile?.name} ${user.profile?.last_name}`
    : user?.profile?.name

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <aside className={styles.sidebar}>
      {/* Branding */}
      <div className={styles.brand} onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logo} alt="VolDigital" className={styles.brandImg} />
        <span className={styles.brandText}>Vol<strong>Digital</strong></span>
      </div>

      {/* User summary */}
      <div className={styles.userBox}>
        <img
          src={user?.profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileName || 'U')}&background=6C63FF&color=fff`}
          alt="" className={styles.avatar}
        />
        <div className={styles.userInfo}>
          <p className={styles.userName}>{profileName}</p>
          <p className={styles.userRole}>{user?.role === 'volunteer' ? 'Voluntario' : user?.profile?.plan_name || 'Organización'}</p>
        </div>
        <NotificationCenter />
      </div>

      {/* Navigation */}
      <nav className={styles.nav}>
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to} to={to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className={styles.bottom}>
        <button className={styles.themeBtn} onClick={toggle}>
          {theme === 'light' ? <FiMoon size={16}/> : <FiSun size={16}/>}
          <span>{theme === 'light' ? 'Modo oscuro' : 'Modo claro'}</span>
        </button>
        <button className={`${styles.themeBtn} ${styles.logout}`} onClick={handleLogout}>
          <FiLogOut size={16}/><span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  )
}
