import { useState, useEffect } from 'react'
import { FiEdit2, FiMapPin, FiPhone, FiCalendar, FiSave, FiX, FiUpload } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import TagBadge from '../../components/common/TagBadge'
import toast from 'react-hot-toast'
import styles from './VolProfile.module.css'

export default function VolProfile() {
  const { user, refreshUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [allTags, setAllTags] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})

  const vol = user?.profile

  useEffect(() => {
    api.get('/tags').then(r => setAllTags(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (vol) {
      // vol.tags may be an array of objects (from /volunteers/:id/full) or the /auth/me
      // payload may include `tag_ids` as CSV. Normalize both cases to tagIds array.
      let tagIds = []
      if (Array.isArray(vol.tags)) {
        tagIds = vol.tags.map(t => t.id).filter(Boolean)
      } else if (vol.tag_ids) {
        tagIds = ('' + vol.tag_ids).split(',').map(n => Number(n)).filter(Boolean)
      }

      setForm({
        name: vol.name || '', last_name: vol.last_name || '',
        bio: vol.bio || '', phone: vol.phone || '',
        city: vol.city || '', birth_date: vol.birth_date?.slice(0,10) || '',
        avatar_url: vol.avatar_url || '', banner_url: vol.banner_url || '',
        tagIds
      })
    }
  }, [vol])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const toggleTag = (id) => {
    setForm(f => ({
      ...f,
      tagIds: f.tagIds.includes(id) ? f.tagIds.filter(t => t !== id) : [...f.tagIds, id]
    }))
  }

  const uploadFile = async (file, field) => {
    const fd = new FormData(); fd.append('file', file)
    const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    set(field, res.data.url)
    toast.success('Imagen subida')
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put(`/volunteers/${vol.id}`, form)
      await refreshUser()
      setEditing(false)
      toast.success('Perfil actualizado')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (!vol) return null

  // Build tags for display: prefer vol.tags array, fallback to matching tag_ids against allTags
  let tags = []
  if (Array.isArray(vol.tags)) {
    tags = vol.tags.filter(t => t.id)
  } else if (vol.tag_ids && allTags.length) {
    const ids = ('' + vol.tag_ids).split(',').map(n => Number(n)).filter(Boolean)
    tags = ids.map(id => allTags.find(t => t.id === id)).filter(Boolean)
  }
  const displayName = `${vol.name} ${vol.last_name}`
  const avatarSrc = form.avatar_url || vol.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=6C63FF&color=fff&size=120`

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className={styles.wrapper}>
          {/* Banner */}
          <div className={styles.bannerWrap}>
            <div
              className={styles.banner}
              style={{
                backgroundImage: (editing ? form.banner_url : vol.banner_url)
                  ? `url(${editing ? form.banner_url : vol.banner_url})`
                  : 'linear-gradient(135deg, var(--primary) 0%, #4A44CC 50%, var(--secondary) 100%)'
              }}
            />
            {editing && (
              <label className={styles.bannerEdit}>
                <FiUpload size={14} /> Cambiar banner
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'banner_url')} />
              </label>
            )}
          </div>

          {/* Avatar + header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrap}>
              <img src={avatarSrc} alt="" className={styles.avatar} />
              {editing && (
                <label className={styles.avatarEdit} title="Cambiar foto">
                  <FiUpload size={14} />
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'avatar_url')} />
                </label>
              )}
            </div>

            <div className={styles.headerInfo}>
              <h1 className={styles.name}>{displayName}</h1>
              <span className={styles.role}>Voluntario · {vol.city || 'Bucaramanga'}</span>
            </div>

            <div className={styles.editBtns}>
              {editing ? (
                <>
                  <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={loading}>
                    <FiSave size={14} />{loading ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setEditing(false)}>
                    <FiX size={14} />Cancelar
                  </button>
                </>
              ) : (
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                  <FiEdit2 size={14} />Editar perfil
                </button>
              )}
            </div>
          </div>

          {/* Body */}
          <div className={styles.body}>
            {editing ? (
              <div className={styles.editForm}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Apellido</label>
                    <input className="form-input" value={form.last_name} onChange={e => set('last_name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Bio</label>
                  <textarea className="form-input" rows={3} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Cuéntanos sobre ti..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Teléfono</label>
                    <input className="form-input" value={form.phone} onChange={e => set('phone', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ciudad</label>
                    <input className="form-input" value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Mis intereses</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {allTags.map(t => (
                      <TagBadge key={t.id} name={t.name} color={t.color}
                        selected={form.tagIds.includes(t.id)} onClick={() => toggleTag(t.id)} />
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">URL banner (o sube imagen arriba)</label>
                  <input className="form-input" value={form.banner_url} onChange={e => set('banner_url', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            ) : (
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h3 className={styles.sectionTitle}>Acerca de mí</h3>
                  <p className={styles.bio}>{vol.bio || 'Sin descripción aún. ¡Edita tu perfil!'}</p>
                  <div className={styles.metaList}>
                    {vol.city && <div className={styles.metaItem}><FiMapPin /> {vol.city}</div>}
                    {vol.phone && <div className={styles.metaItem}><FiPhone /> {vol.phone}</div>}
                    {vol.birth_date && <div className={styles.metaItem}><FiCalendar /> {new Date(vol.birth_date).toLocaleDateString('es-CO')}</div>}
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3 className={styles.sectionTitle}>Mis intereses</h3>
                  {tags.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {tags.map(t => <TagBadge key={t.id} name={t.name} color={t.color} size="lg" />)}
                    </div>
                  ) : (
                    <p className={styles.empty}>Sin intereses. Edita tu perfil para agregarlos.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
