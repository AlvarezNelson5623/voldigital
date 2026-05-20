import { useState, useEffect } from 'react'
import { FiSearch, FiCompass, FiBookmark, FiArrowRight, FiFolder } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import ProjectCard from '../../components/common/ProjectCard'
import ProjectDetailModal from './ProjectDetailModal'
import { PROJECT_STATUS, APP_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'
import styles from './VolProjects.module.css'

const TABS = [
  { key: 'recommended', label: 'Recomendados',    icon: FiBookmark },
  { key: 'discover',    label: 'Descubre nuevos', icon: FiCompass  },
  { key: 'myprojects',  label: 'Mis proyectos',   icon: FiFolder   },
]

export default function VolProjects() {
  const { user } = useAuth()
  const volId    = user?.profile?.id
  const [tab, setTab] = useState('recommended')
  const [data, setData] = useState({ recommended: [], discover: [], myprojects: [] })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!volId) return
    setLoading(true)
    Promise.all([
      api.get(`/projects/recommended/${volId}`),
      api.get(`/projects/discover/${volId}`),
      api.get(`/volunteers/${volId}/projects`),
    ]).then(([rec, disc, mine]) => {
      setData({ recommended: rec.data, discover: disc.data, myprojects: mine.data })
    }).catch(() => toast.error('Error al cargar proyectos'))
      .finally(() => setLoading(false))
  }, [volId])

  const list = data[tab] || []
  const filtered = list.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.org_name?.toLowerCase().includes(search.toLowerCase())
  )

  const handleApply = async (projectId) => {
    try {
      await api.post('/applications', { project_id: projectId })
      toast.success('¡Postulación enviada!')
      setSelected(null)
      // Refresh
      const [rec, disc, mine] = await Promise.all([
        api.get(`/projects/recommended/${volId}`),
        api.get(`/projects/discover/${volId}`),
        api.get(`/volunteers/${volId}/projects`),
      ])
      setData({ recommended: rec.data, discover: disc.data, myprojects: mine.data })
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al postular')
    }
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Proyectos</h1>
          <p>Encuentra y gestiona tus oportunidades de voluntariado</p>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button key={t.key}
                className={`${styles.tab} ${tab === t.key ? styles.active : ''}`}
                onClick={() => { setTab(t.key); setSearch('') }}
              >
                {Icon && <Icon size={16} style={{ marginRight: 8 }} />}
                {t.label}
              </button>
            )
          })}
        </div>

        {/* Section description */}
        {tab === 'discover' && (
          <div className={styles.discoverBanner}>
            <FiCompass size={20} />
            <p><strong>Descubre nuevos intereses</strong> — Proyectos fuera de tus etiquetas habituales. ¡Amplía tu horizonte!</p>
          </div>
        )}

        {/* Search */}
        <div className={styles.searchWrap}>
          <FiSearch className={styles.searchIcon} />
          <input
            className={`form-input ${styles.searchInput}`}
            placeholder="Buscar proyectos..."
            value={search} onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* My Projects: show status badges */}
        {tab === 'myprojects' && !loading && (
          <div className={styles.myGrid}>
            {filtered.length === 0 && (
              <div className={styles.empty}>
                <FiFolder size={40} style={{ color: 'var(--text-3)' }} />
                <p>Aún no has aplicado a ningún proyecto.</p>
                <button className="btn btn-primary" onClick={() => setTab('recommended')}>
                  Ver recomendados <FiArrowRight />
                </button>
              </div>
            )}
            {filtered.map(p => (
              <div key={p.id} className={`card ${styles.myCard}`}>
                {p.image_url && <img src={p.image_url} alt="" className={styles.myCardImg} />}
                <div className={styles.myCardBody}>
                  <div className={styles.myCardHeader}>
                    <h3 className={styles.myCardTitle}>{p.title}</h3>
                    <span className={`badge ${APP_STATUS[p.application_status]?.badge}`}>
                      {APP_STATUS[p.application_status]?.label}
                    </span>
                  </div>
                  <p className={styles.myCardOrg}>{p.org_name}</p>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                    <span className={`badge ${PROJECT_STATUS[p.status]?.badge}`}>{PROJECT_STATUS[p.status]?.label}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
                      Aplicado: {new Date(p.applied_at).toLocaleDateString('es-CO')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Project grid */}
        {tab !== 'myprojects' && (
          loading ? (
            <div className="projects-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ height: 300 }}>
                  <div className="skeleton" style={{ height: 160 }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 14, width: '70%' }} />
                    <div className="skeleton" style={{ height: 11, width: '90%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <FiSearch size={40} style={{ color: 'var(--text-3)' }} />
              <p>{search ? 'Sin resultados' : 'No hay proyectos disponibles en este momento'}</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
                <ProjectCard key={p.id} project={p} onClick={() => setSelected(p)} />
              ))}
            </div>
          )
        )}

        {/* Project detail modal */}
        {selected && (
          <ProjectDetailModal
            project={selected}
            onClose={() => setSelected(null)}
            onApply={() => handleApply(selected.id)}
          />
        )}
      </main>
    </div>
  )
}
