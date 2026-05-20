import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { FiUsers, FiFilter, FiRepeat } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import TagBadge from '../../components/common/TagBadge'
import { APP_STATUS } from '../../utils/constants'
import styles from './OrgVolunteers.module.css'

const FILTERS = [
  { key: '',         label: 'Todos' },
  { key: 'pending',  label: 'En postulación' },
  { key: 'accepted', label: 'Activos' },
  { key: 'rejected', label: 'Rechazados' },
]

export default function OrgVolunteers() {
  const { user } = useAuth()
  const org      = user?.profile
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading]       = useState(true)
  const [filter, setFilter]         = useState('')
  const [search, setSearch]         = useState('')

  useEffect(() => {
    if (!org?.id) return
    setLoading(true)
    const params = filter ? `?status=${filter}` : ''
    api.get(`/organizations/${org.id}/volunteers${params}`)
      .then(r => setVolunteers(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [org?.id, filter])

  const filtered = volunteers.filter(v =>
    `${v.name} ${v.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    v.project_title?.toLowerCase().includes(search.toLowerCase())
  )
  const navigate = useNavigate()

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Voluntarios</h1>
          <p>Gestiona las personas vinculadas a los proyectos de tu organización</p>
        </div>

        {/* Filters */}
        <div className={styles.topBar}>
          <div className={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f.key}
                className={`${styles.filterBtn} ${filter === f.key ? styles.active : ''}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className={styles.searchWrap}>
            <input
              className="form-input"
              placeholder="Buscar voluntario o proyecto..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ width: 240 }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 'var(--radius)' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <FiUsers size={48} style={{ color: 'var(--text-3)' }} />
            <p>No hay voluntarios en este filtro</p>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Voluntario</span>
              <span>Ciudad</span>
              <span>Proyecto</span>
              <span>Estado</span>
              <span>Proyectos en org.</span>
              <span>Fecha</span>
            </div>
            {filtered.map(v => (
              <div
                key={v.application_id}
                className={styles.tableRow}
                onClick={() => navigate(`/voluntario/${v.volunteer_id || v.id || v.user_id || v.application_id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navigate(`/voluntario/${v.volunteer_id || v.id || v.user_id || v.application_id}`) }}
              >
                <div className={styles.volCell}>
                  <img
                    src={v.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${v.name} ${v.last_name}`)}&background=6C63FF&color=fff`}
                    alt="" className={styles.avatar}
                  />
                  <div>
                    <p className={styles.volName}>{v.name} {v.last_name}</p>
                  </div>
                </div>
                <span className={styles.cell}>{v.city || '—'}</span>
                <span className={styles.cell}>{v.project_title}</span>
                <span className={styles.cell}>
                  <span className={`badge badge-${v.application_status}`}>
                    {APP_STATUS[v.application_status]?.label}
                  </span>
                </span>
                <span className={styles.cell}>
                  {v.projects_with_org > 1 ? (
                    <span className={styles.multiProj}><FiRepeat style={{ marginRight: 8 }} /> {v.projects_with_org} proyectos</span>
                  ) : '1 proyecto'}
                </span>
                <span className={styles.cell} style={{ fontSize: 12, color: 'var(--text-3)' }}>
                  {new Date(v.applied_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' })}
                </span>
                <span className={styles.cell}>
                  {v.phone && (
                    (() => {
                      const normalize = (p) => p.replace(/[^0-9]/g, '').replace(/^0+/, '')
                      const np = normalize(v.phone)
                      const text = encodeURIComponent(`Hola ${v.name}, te contacta ${org?.name || 'la organización'}.`)
                      const wa = `https://wa.me/${np}?text=${text}`
                      return (
                        <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" onClick={(e) => e.stopPropagation()}>
                          <FaWhatsapp style={{ color: '#25D366', marginRight: 6 }} /> WhatsApp
                        </a>
                      )
                    })()
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
