import { useEffect, useState } from 'react'
import { FiX, FiMapPin, FiUsers, FiCalendar, FiExternalLink, FiUser } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import TagBadge from '../../components/common/TagBadge'
import { PROJECT_STATUS } from '../../utils/constants'
import styles from './ProjectDetailModal.module.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80'

export default function ProjectDetailModal({ project, onClose, onApply }) {
  const [detail, setDetail] = useState(project)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    api.get(`/projects/${project.id}`).then(r => setDetail(r.data)).catch(() => {})
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [project.id])

  const tags = detail.tags ? detail.tags.split(',').filter(Boolean) : []
  const colors = detail.tag_colors ? detail.tag_colors.split(',') : []
  const status = PROJECT_STATUS[detail.status] || PROJECT_STATUS.recruiting
  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' }) : null

  const handleApply = async () => {
    setApplying(true)
    await onApply()
    setApplying(false)
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>

        <img src={detail.image_url || PLACEHOLDER} alt={detail.title} className={styles.image} />

        <div className={styles.content}>
          <div className={styles.topRow}>
            <span className={`badge ${status.badge}`}>{status.label}</span>
            <Link to={`/organizacion/${detail.org_id}`} onClick={onClose} className={styles.orgLink}>
              {detail.org_avatar && <img src={detail.org_avatar} alt="" className={styles.orgAvatar} />}
              <span className={styles.orgName}>{detail.org_name}</span>
            </Link>
          </div>

          <h2 className={styles.title}>{detail.title}</h2>
          <p className={styles.desc}>{detail.description}</p>

          <div className={styles.meta}>
            {detail.location && <div className={styles.metaItem}><FiMapPin />{detail.location}</div>}
            {detail.max_volunteers && (
              <div className={styles.metaItem}>
                <FiUsers />{detail.accepted_count || 0} de {detail.max_volunteers} voluntarios
              </div>
            )}
            {detail.start_date && <div className={styles.metaItem}><FiCalendar />Inicio: {fmt(detail.start_date)}</div>}
            {detail.end_date   && <div className={styles.metaItem}><FiCalendar />Fin: {fmt(detail.end_date)}</div>}
          </div>

          {tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {tags.map((t, i) => <TagBadge key={i} name={t} color={colors[i]} />)}
            </div>
          )}

          {detail.org_description && (
            <div className={styles.orgSection}>
              <h4>Sobre la organización</h4>
              <p>{detail.org_description}</p>
            </div>
          )}

          {/* 'Ver organización' moved to header as clickable org name/avatar */}

          <div className={styles.actions}>
            {['recruiting','active'].includes(detail.status) && (
              <button className="btn btn-primary" onClick={handleApply} disabled={applying} style={{ flex: 2, justifyContent: 'center' }}>
                {applying ? 'Postulando…' : <><FiUser style={{ marginRight: 8 }} /> Postularme a este proyecto</>}
              </button>
            )}
            <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: 'center' }}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
