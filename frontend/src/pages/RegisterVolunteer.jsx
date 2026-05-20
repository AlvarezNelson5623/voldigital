import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiStar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import TagBadge from '../components/common/TagBadge'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

const STEPS = ['Datos personales', 'Cuenta', 'Intereses']

export default function RegisterVolunteer() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [step, setStep] = useState(0)
  const [allTags, setAllTags] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '', last_name: '', phone: '', city: 'Bucaramanga', birth_date: '',
    email: '', password: '', confirmPassword: '',
    tagIds: []
  })

  useEffect(() => {
    api.get('/tags').then(r => {
      console.debug('API /tags ->', r.data)
      setAllTags(r.data)
    }).catch(() => {})
  }, [])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleTag = (id) => {
    setForm(f => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter(t => t !== id) : [...f.tagIds, id]
    }))
  }

  const nextStep = (e) => {
    e.preventDefault()
    if (step === 1 && form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden'); return
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.tagIds.length === 0) { toast.error('Selecciona al menos un interés'); return }
    setLoading(true)
    try {
      await api.post('/auth/register/volunteer', {
        name: form.name, last_name: form.last_name, phone: form.phone,
        city: form.city, birth_date: form.birth_date,
        email: form.email, password: form.password,
        tagIds: form.tagIds
      })
      await login(form.email, form.password)
      toast.success('¡Cuenta creada! Bienvenido/a')
      navigate('/voluntario/perfil')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.center}>
        <div className={`card ${styles.card}`} style={{ maxWidth: 520 }}>
          <div className={styles.header}>
            <span className={styles.emoji}><FiUser /></span>
            <h1 className={styles.title}>Crea tu cuenta de voluntario</h1>
          </div>

          {/* Step indicator */}
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <>
                <div key={s} className={`${styles.step} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.done : ''}`} />}
              </>
            ))}
          </div>

          {/* Step 0: Personal data */}
          {step === 0 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Nombre *</label>
                  <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Juan" />
                </div>
                <div className="form-group">
                  <label className="form-label">Apellido *</label>
                  <input className="form-input" required value={form.last_name} onChange={e => set('last_name', e.target.value)} placeholder="Pérez" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono</label>
                <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+57 300 000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Ciudad</label>
                <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} placeholder="Bucaramanga" />
              </div>
              <div className="form-group">
                <label className="form-label">Fecha de nacimiento</label>
                <input className="form-input" type="date" value={form.birth_date} onChange={e => set('birth_date', e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Siguiente →</button>
            </form>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Correo electrónico *</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@correo.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <div className={styles.inputWrap}>
                  <input
                    className={`form-input ${styles.inputPadRight}`}
                    type={show ? 'text' : 'password'} required minLength={6}
                    value={form.password} onChange={e => set('password', e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                  />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
                    {show ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar contraseña *</label>
                <input
                  className="form-input" type="password" required
                  value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="Repite la contraseña"
                />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: 'center' }}>← Atrás</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Siguiente →</button>
              </div>
            </form>
          )}

          {/* Step 2: Tags */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <p style={{ fontSize: 14, color: 'var(--text-2)', textAlign: 'center' }}>
                Selecciona tus causas e intereses. Los usaremos para recomendarte proyectos.
              </p>
              <div className={styles.tagsPicker}>
                {allTags.map(t => (
                  <TagBadge
                    key={t.id} name={t.name} color={t.color}
                    selected={form.tagIds.includes(t.id)}
                    onClick={() => toggleTag(t.id)}
                    size="lg"
                  />
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>
                Seleccionados: {form.tagIds.length}
              </p>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Atrás</button>
                <button type="submit" className="btn btn-secondary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Creando cuenta…' : <><FiStar style={{ marginRight: 8 }} /> ¡Comenzar!</>}
                </button>
              </div>
            </form>
          )}

          <p className={styles.footer}>
            ¿Ya tienes cuenta? <Link to="/login" className={styles.link}>Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
