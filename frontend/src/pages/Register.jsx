import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import styles from './Auth.module.css'
import { FiUser, FiBriefcase } from 'react-icons/fi'

export default function Register() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const rol = params.get('rol')

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.center}>
        <div className={`card ${styles.card}`}>
          <div className={styles.header}>
            <h1 className={styles.title}>Únete a VolDigital</h1>
            <p className={styles.sub}>¿Cómo deseas participar?</p>
          </div>

            <div className={styles.roleGrid}>
            <button
              className={`${styles.roleBtn} ${rol === 'voluntario' ? styles.selected : ''}`}
              onClick={() => navigate('/registro/voluntario')}
            >
              <span className={styles.roleIcon}><FiUser /></span>
              Voluntario
              <span style={{ fontSize: 11, color: 'var(--secondary)', fontWeight: 500 }}>100% gratis</span>
            </button>
            <button
              className={`${styles.roleBtn} ${rol === 'organizacion' ? styles.selected : ''}`}
              onClick={() => navigate('/registro/organizacion')}
            >
              <span className={styles.roleIcon}><FiBriefcase /></span>
              Organización
              <span style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 500 }}>Desde $0/mes</span>
            </button>
          </div>

          <p className={styles.footer}>
            ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
