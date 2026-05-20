import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../../components/layout/Sidebar'
import { FiMapPin, FiPhone, FiMail, FiCalendar } from 'react-icons/fi'
import api from '../../services/api'
import TagBadge from '../../components/common/TagBadge'
import styles from './VolProfile.module.css'

export default function VolView() {
  const { id } = useParams()
  const [vol, setVol] = useState(null)
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { api.get('/tags').then(r => setAllTags(r.data)).catch(() => {}) }, [])

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/volunteers/${id}`)
      .then(async (r) => {
        const data = r.data
        // If payload looks incomplete, try a /full endpoint as fallback
        const keys = Object.keys(data || {})
        if (keys.length < 6) {
          try {
            const full = await api.get(`/volunteers/${id}/full`)
            setVol(full.data)
            return
          } catch (e) {
            // ignore and fallthrough to set original
          }
        }
        setVol(data)
      })
      .catch(() => setVol(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">Cargando…</main>
    </div>
  )

  if (!vol) return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">Voluntario no encontrado</main>
    </div>
  )

  // Normalize common field names from different backend shapes
  const name = vol.name || vol.first_name || vol.user?.name || ''
  const lastName = vol.last_name || vol.lastName || vol.user?.last_name || ''
  const displayName = `${name} ${lastName}`.trim()
  const avatarUrl = vol.avatar_url || vol.avatar || vol.user?.avatar_url || ''
  const avatarSrc = avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'Voluntario')}&background=6C63FF&color=fff&size=120`
  const bannerUrl = vol.banner_url || vol.banner || vol.user?.banner_url || ''
  const email = vol.email || vol.user?.email || vol.contact_email || vol.email_address || ''
  const phone = vol.phone || vol.user?.phone || vol.contact_phone || ''
  const birth = vol.birth_date || vol.birthdate || vol.dob || vol.user?.birth_date || ''

  const calcAge = (dob) => {
    if (!dob) return null
    const b = new Date(dob)
    if (isNaN(b)) return null
    const today = new Date()
    let age = today.getFullYear() - b.getFullYear()
    const m = today.getMonth() - b.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < b.getDate())) age--
    return age
  }
  const age = calcAge(birth)

  // build tags
  let tags = []
  if (Array.isArray(vol.tags)) {
    tags = vol.tags.filter(t => t && t.id)
  } else if (typeof vol.tags === 'string' && vol.tags.trim()) {
    // backend may return a CSV of tag names: "Ambiental,Educación"
    const names = vol.tags.split(',').map(s => s.trim()).filter(Boolean)
    if (allTags.length) {
      tags = names.map(n => allTags.find(t => t.name === n)).filter(Boolean)
    } else {
      // fallback: build simple objects with name only
      tags = names.map((n, i) => ({ id: `name-${i}`, name: n, color: '#6C63FF' }))
    }
  } else if (vol.tag_ids && allTags.length) {
    const ids = ('' + vol.tag_ids).split(',').map(n => Number(n)).filter(Boolean)
    tags = ids.map(i => allTags.find(t => t.id === i)).filter(Boolean)
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className={styles.wrapper}>
          <div className={styles.bannerWrap}>
            <div className={styles.banner} style={{ backgroundImage: vol.banner_url ? `url(${vol.banner_url})` : 'linear-gradient(135deg, var(--primary) 0%, #4A44CC 50%, var(--secondary) 100%)' }} />
          </div>

          <div className={styles.profileHeader}>
            <div className={styles.avatarWrap}>
              <img src={avatarSrc} alt="" className={styles.avatar} />
            </div>

            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{displayName || 'Voluntario'}</h1>
              <span className={styles.role}>Voluntario · {vol.city || vol.location || '—'}</span>
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3 className={styles.sectionTitle}>Acerca de</h3>
                <p className={styles.bio}>{vol.bio || vol.description || 'Sin descripción.'}</p>
                <div className={styles.metaList}>
                  {(vol.city || vol.location) && <div className={styles.metaItem}><FiMapPin /> {vol.city || vol.location}</div>}
                  {phone && <div className={styles.metaItem}><FiPhone /> {phone}</div>}
                  {email && <div className={styles.metaItem}><FiMail /> {email}</div>}
                  {age !== null && <div className={styles.metaItem}><FiCalendar /> {age} años</div>}
                </div>
              </div>

              <div className={styles.infoCard}>
                <h3 className={styles.sectionTitle}>Intereses</h3>
                {tags.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {tags.map(t => <TagBadge key={t.id} name={t.name} color={t.color} size="lg" />)}
                  </div>
                ) : <p className={styles.empty}>Sin intereses listados</p>}
                {/* banner pequeño eliminado — se usa solo el banner superior */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
