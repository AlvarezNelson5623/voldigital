import { useState, useEffect } from 'react'
import { FiCheck, FiZap, FiStar } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import toast from 'react-hot-toast'
import styles from './OrgPlans.module.css'
import planStyles from '../Plans.module.css'

const PLANS = [
  {
    id: 1, name: 'Gratis', price: 0, color: '#6B7280',
    features: [
      '1 proyecto al mes',
      'Perfil de organización',
      'Imagen y banner de perfil',
      'Etiquetas para emparejamiento',
    ]
  },
  {
    id: 2, name: 'Starter', price: 30000, color: '#3B82F6',
    features: [
      '10 proyectos al mes',
      'Pestaña de voluntarios',
      'Ver activos, pendientes y rechazados',
      'Historial multi-proyecto por voluntario',
      'Todo lo del plan Gratis',
    ]
  },
  {
    id: 3, name: 'Professional', price: 70000, color: '#8B5CF6', popular: true,
    features: [
      '20 proyectos al mes',
      'Dashboard analítico con gráficas',
      'Índice de proyectos completados',
      'Estadísticas de voluntarios',
      'Todo lo del plan Starter',
    ]
  },
  {
    id: 4, name: 'Enterprise', price: 150000, color: '#F59E0B',
    features: [
      '50 proyectos al mes',
      '2 anuncios destacados en el home (5 días c/u)',
      'Banner de publicidad en carrusel',
      'Mayor visibilidad de la organización',
      'Todo lo del plan Professional',
    ]
  },
]

export default function OrgPlans() {
  const { user, refreshUser } = useAuth()
  const org     = user?.profile
  const planId  = org?.plan_id || 1
  const [loading, setLoading] = useState(null) // planId being upgraded

  const handleUpgrade = async (targetPlanId) => {
    if (targetPlanId <= planId) return
    const plan = PLANS.find(p => p.id === targetPlanId)
    if (!confirm(`¿Cambiar al plan ${plan.name} por $${plan.price.toLocaleString('es-CO')}/mes? (Simulado, sin pago real)`)) return
    setLoading(targetPlanId)
    try {
      await api.post('/plans/upgrade', { planId: targetPlanId })
      await refreshUser()
      toast.success(<><FiZap style={{ marginRight: 8 }} />{`¡Plan ${plan.name} activado!`}</>)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cambiar plan')
    } finally {
      setLoading(null) }
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Planes</h1>
          <p>Elige el plan que mejor impulse a tu organización</p>
        </div>

        <div className={styles.currentPlan}>
          <span>Plan actual: </span>
          <strong style={{ color: PLANS.find(p => p.id === planId)?.color }}>
            {PLANS.find(p => p.id === planId)?.name}
          </strong>
          {planId > 1 && (
            <span style={{ fontSize: 13, color: 'var(--text-2)', marginLeft: 8 }}>
              — ${PLANS.find(p => p.id === planId)?.price.toLocaleString('es-CO')}/mes (simulado)
            </span>
          )}
        </div>

        <div className={styles.planGrid}>
          {PLANS.map(plan => {
            const isCurrent   = plan.id === planId
            const isDowngrade = plan.id < planId
            return (
              <div
                key={plan.id}
                className={`${styles.planCard} ${isCurrent ? styles.current : ''} ${plan.popular ? styles.popular : ''}`}
                style={{ '--pc': plan.color }}
              >
                {plan.popular && <div className={styles.popularBadge}><FiStar style={{ marginRight: 8 }} />Más popular</div>}
                {isCurrent    && <div className={styles.currentBadge}>✓ Plan actual</div>}

                <div className={styles.planTop}>
                  <h3 className={styles.planName}>{plan.name}</h3>
                  <div className={styles.planPrice}>
                    {plan.price === 0
                      ? <span className={styles.freeLabel}>Gratis</span>
                      : <><span className={styles.priceAmount}>${plan.price.toLocaleString('es-CO')}</span><span className={styles.pricePeriod}>/mes</span></>
                    }
                  </div>
                </div>

                <ul className={styles.featureList}>
                  {plan.features.map(f => (
                    <li key={f}><FiCheck size={14} className={styles.checkIcon} /> {f}</li>
                  ))}
                </ul>

                <button
                  className={`btn ${isCurrent ? 'btn-ghost' : isDowngrade ? 'btn-ghost' : 'btn-primary'} ${styles.planBtn}`}
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isCurrent || isDowngrade || loading === plan.id}
                  style={!isCurrent && !isDowngrade ? { background: plan.color } : {}}
                >
                  {loading === plan.id ? 'Procesando…'
                    : isCurrent   ? 'Plan actual'
                    : isDowngrade ? 'Plan inferior'
                    : <><FiZap size={14} /> Cambiar a {plan.name}</>}
                </button>
              </div>
            )
          })}
        </div>

        <p className={styles.disclaimer}>
          * Los pagos son simulados para esta demo. No se realizan cargos reales.
        </p>
      </main>
    </div>
  )
}
