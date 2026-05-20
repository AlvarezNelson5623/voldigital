import { useNavigate } from 'react-router-dom'
import { FiMapPin, FiUsers, FiCalendar } from 'react-icons/fi'
import TagBadge from './TagBadge'
import { PROJECT_STATUS } from '../../utils/constants'
import styles from './ProjectCard.module.css'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80'

export default function ProjectCard({ project, showOrg = true, onClick }) {
  const navigate = useNavigate()
  const status = PROJECT_STATUS[project.status] || PROJECT_STATUS.recruiting
  const tags = project.tags ? project.tags.split(',').filter(Boolean) : []
  const colors = project.tag_colors ? project.tag_colors.split(',') : []

  const handleClick = () => {
    if (onClick) onClick(project)
    else navigate(`/proyecto/${project.id}`)
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'short' }) : null

  return (
    <div className={`card ${styles.card}`} onClick={handleClick}>
      <div className={styles.imgWrap}>
        <img src={project.image_url || PLACEHOLDER} alt={project.title} className={styles.img} />
        <span className={`badge ${status.badge} ${styles.statusBadge}`}>{status.label}</span>
      </div>

      <div className={styles.body}>
        {showOrg && (
          <div className={styles.orgRow}>
            {project.org_avatar && <img src={project.org_avatar} className={styles.orgAvatar} alt="" />}
            <span className={styles.orgName}>{project.org_name}</span>
          </div>
        )}

        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.desc}>{project.description?.slice(0, 120)}{project.description?.length > 120 ? '…' : ''}</p>

        <div className={styles.meta}>
          {project.location && (
            <span className={styles.metaItem}><FiMapPin size={13}/>{project.location}</span>
          )}
          {project.max_volunteers && (
            <span className={styles.metaItem}><FiUsers size={13}/>{project.accepted_count || 0}/{project.max_volunteers}</span>
          )}
          {(project.start_date || project.end_date) && (
            <span className={styles.metaItem}><FiCalendar size={13}/>
              {fmt(project.start_date)}{project.end_date ? ` → ${fmt(project.end_date)}` : ''}
            </span>
          )}
        </div>

        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.slice(0, 3).map((t, i) => (
              <TagBadge key={i} name={t} color={colors[i]} size="sm" />
            ))}
            {tags.length > 3 && <span className={styles.moreTags}>+{tags.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  )
}
