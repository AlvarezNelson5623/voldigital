import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FiMapPin, FiPhone, FiGlobe } from 'react-icons/fi'
import api from '../../services/api'
import TagBadge from '../../components/common/TagBadge'
import styles from './OrgProfile.module.css'

export default function OrgPublic() {
  const { id } = useParams()
  const [org, setOrg] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/organizations/${id}`).then(r => setOrg(r.data)).catch(() => setOrg(null)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="main-content">Cargando organización…</div>
  if (!org) return <div className="main-content">Organización no encontrada</div>

  const avatarSrc = org.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=6C63FF&color=fff&size=120`

  return (
    <main className="main-content">
      <div className={styles.wrapper} style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className={styles.bannerWrap}>
          <div className={styles.banner} style={{ backgroundImage: org.banner_url ? `url(${org.banner_url})` : 'linear-gradient(135deg,#00D4A3 0%, #00A882 40%, var(--primary) 100%)' }} />
        </div>

        <div className={styles.profileHeader}>
          <div className={styles.avatarWrap}>
            <img src={avatarSrc} alt="" className={styles.avatar} />
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.name}>{org.name}</h1>
            <span className={styles.role}>Organización · {org.city || '—'}</span>
            <p className={styles.quote} style={{ marginTop: 8 }}>{org.description}</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <Link to="/" className="btn btn-ghost">Volver</Link>
          </div>
        </div>

        <div className={styles.body}>
          <div className={styles.infoGrid}>
            <div>
              <h3 className={styles.sectionTitle}>Acerca de la organización</h3>
              <p className={styles.desc}>{org.description || 'Sin descripción.'}</p>
              <div className={styles.metaList}>
                {org.city    && <div className={styles.metaItem}><FiMapPin /> {org.address ? `${org.address}, ` : ''}{org.city}</div>}
                {org.phone   && <div className={styles.metaItem}><FiPhone /> {org.phone}</div>}
                {org.website && <div className={styles.metaItem}><FiGlobe /> <a href={org.website} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{org.website}</a></div>}
              </div>
            </div>
            <div>
              <h3 className={styles.sectionTitle}>Proyectos</h3>
              <p className={styles.empty}>Ver proyectos públicos en la sección principal.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
