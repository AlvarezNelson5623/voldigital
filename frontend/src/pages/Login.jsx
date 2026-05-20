import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      toast.success(`¡Bienvenido/a de vuelta!`)
      navigate(user.role === 'volunteer' ? '/voluntario/perfil' : '/organizacion/perfil')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Credenciales inválidas')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.center}>
        <div className={`card ${styles.card}`}>
          <div className={styles.header}>
            <img src={logo} alt="VolDigital" className={styles.logo} />
            <h1 className={styles.title}>Bienvenido/a</h1>
            <p className={styles.sub}>Ingresa a tu cuenta de VolDigital</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className={styles.inputWrap}>
                <FiMail className={styles.inputIcon} />
                <input
                  type="email" className={`form-input ${styles.inputPad}`}
                  placeholder="tu@correo.com" required
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <div className={styles.inputWrap}>
                <FiLock className={styles.inputIcon} />
                <input
                  type={show ? 'text' : 'password'}
                  className={`form-input ${styles.inputPad} ${styles.inputPadRight}`}
                  placeholder="Tu contraseña" required
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
                  {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px' }} disabled={loading}>
              {loading ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>

          <p className={styles.footer}>
            ¿No tienes cuenta? <Link to="/registro" className={styles.link}>Regístrate gratis</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
