import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiCheck, FiBriefcase, FiSend } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'
import planStyles from './Plans.module.css'

const PLANS = [
  { id: 1, name: 'Gratis',       price: 0,       color: '#6B7280', features: ['1 proyecto/mes', 'Perfil organización'] },
  { id: 2, name: 'Starter',      price: 30000,   color: '#3B82F6', features: ['10 proyectos/mes', 'Gestión de voluntarios', 'Todo lo de Gratis'] },
  { id: 3, name: 'Professional', price: 70000,   color: '#8B5CF6', features: ['20 proyectos/mes', 'Dashboard analítico', 'Todo lo de Starter'] },
  { id: 4, name: 'Enterprise',   price: 150000,  color: '#F59E0B', features: ['50 proyectos/mes', '2 anuncios destacados (5 días)', 'Todo lo de Professional'] },
]

const STEPS = ['Datos org.', 'Cuenta', 'Plan']

export default function RegisterOrganization() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    name: '', description: '', phone: '', address: '', city: 'Bucaramanga', website: '',
    email: '', password: '', confirmPassword: '',
    planId: 1
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const nextStep = (e) => {
    e.preventDefault()
    if (step === 1 && form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden'); return
    }
    setStep(s => s + 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register/organization', {
        name: form.name, description: form.description, phone: form.phone,
        address: form.address, city: form.city, website: form.website,
        email: form.email, password: form.password
      })
      await login(form.email, form.password)
      // Upgrade plan if not free
      if (form.planId > 1) {
        await api.post('/plans/upgrade', { planId: form.planId })
      }
      toast.success(`¡Bienvenido/a! Plan ${PLANS.find(p => p.id === form.planId)?.name} activo.`)
      navigate('/organizacion/perfil')
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
        <div className={`card ${styles.card}`} style={{ maxWidth: step === 2 ? 760 : 520 }}>
          <div className={styles.header}>
            <span className={styles.emoji}><FiBriefcase /></span>
            <h1 className={styles.title}>Registra tu organización</h1>
          </div>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className={`${styles.step} ${i < step ? styles.done : ''} ${i === step ? styles.active : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < step ? styles.done : ''}`} />}
              </span>
            ))}
          </div>

          {/* Step 0: Org data */}
          {step === 0 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Nombre de la organización *</label>
                <input className="form-input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Fundación Vida Verde" />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea className="form-input" rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="¿A qué se dedica tu organización?" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+57 300 000 0000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Calle 00 # 00-00" />
              </div>
              <div className="form-group">
                <label className="form-label">Sitio web</label>
                <input className="form-input" type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://miorganizacion.org" />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>Siguiente →</button>
            </form>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <form onSubmit={nextStep} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Correo electrónico *</label>
                <input className="form-input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="contacto@miorg.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña *</label>
                <div className={styles.inputWrap}>
                  <input className={`form-input ${styles.inputPadRight}`} type={show ? 'text' : 'password'} required minLength={6} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Mínimo 6 caracteres" />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShow(s => !s)}>
                    {show ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirmar contraseña *</label>
                <input className="form-input" type="password" required value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Repite la contraseña" />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(0)} style={{ flex: 1, justifyContent: 'center' }}>← Atrás</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}>Siguiente →</button>
              </div>
            </form>
          )}

          {/* Step 2: Plan selector */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <p style={{ textAlign: 'center', color: 'var(--text-2)', fontSize: 14, marginBottom: 24 }}>
                Elige el plan que mejor se adapte a tu organización. Podrás cambiarlo después.
              </p>
              <div className={planStyles.planGrid}>
                {PLANS.map(plan => (
                  <div
                    key={plan.id}
                    className={`${planStyles.planCard} ${form.planId === plan.id ? planStyles.selected : ''}`}
                    style={{ '--plan-color': plan.color }}
                    onClick={() => set('planId', plan.id)}
                  >
                    <div className={planStyles.planName}>{plan.name}</div>
                    <div className={planStyles.planPrice}>
                      {plan.price === 0 ? 'Gratis' : `$${plan.price.toLocaleString('es-CO')}/mes`}
                    </div>
                    <ul className={planStyles.planFeatures}>
                      {plan.features.map(f => <li key={f}><FiCheck size={13} /> {f}</li>)}
                    </ul>
                    {form.planId === plan.id && <div className={planStyles.selectedBadge}>✓ Seleccionado</div>}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>← Atrás</button>
                <button type="submit" className="btn btn-secondary" style={{ flex: 2, justifyContent: 'center' }} disabled={loading}>
                  {loading ? 'Creando cuenta…' : <><FiSend style={{ marginRight: 8 }} /> ¡Crear cuenta!</>}
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
