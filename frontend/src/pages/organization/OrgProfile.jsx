import { useState, useEffect } from 'react'
import { FiEdit2, FiMapPin, FiPhone, FiGlobe, FiSave, FiX, FiUpload } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import toast from 'react-hot-toast'
import { PLANS } from '../../utils/constants'
import styles from './OrgProfile.module.css'

export default function OrgProfile() {
  const { user, refreshUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({})

  const org = user?.profile

  useEffect(() => {
    if (org) {
      setForm({
        name: org.name || '', description: org.description || '',
        phone: org.phone || '', address: org.address || '',
        city: org.city || '', website: org.website || '',
        avatar_url: org.avatar_url || '', banner_url: org.banner_url || ''
      })
    }
  }, [org])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const uploadFile = async (file, field) => {
    const fd = new FormData(); fd.append('file', file)
    const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
    set(field, res.data.url)
    toast.success('Imagen subida')
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.put(`/organizations/${org.id}`, form)
      await refreshUser()
      setEditing(false)
      toast.success('Perfil actualizado')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  if (!org) return null

  const planInfo = PLANS[org.plan_id] || PLANS[1]
  const avatarSrc = (editing ? form.avatar_url : org.avatar_url) ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(org.name)}&background=6C63FF&color=fff&size=120`

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className={styles.wrapper}>
          {/* Banner */}
          <div className={styles.bannerWrap}>
            <div className={styles.banner} style={{
              backgroundImage: (editing ? form.banner_url : org.banner_url)
                ? `url(${editing ? form.banner_url : org.banner_url})`
                : 'linear-gradient(135deg, #00D4A3 0%, #00A882 40%, var(--primary) 100%)'
            }} />
            {editing && (
              <label className={styles.bannerEdit}>
                <FiUpload size={14} /> Cambiar banner
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'banner_url')} />
              </label>
            )}
          </div>

          {/* Header */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarWrap}>
              <img src={avatarSrc} alt="" className={styles.avatar} />
              {editing && (
                <label className={styles.avatarEdit} title="Cambiar logo">
                  <FiUpload size={14} />
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => e.target.files[0] && uploadFile(e.target.files[0], 'avatar_url')} />
                </label>
              )}
            </div>

            <div className={styles.headerInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <h1 className={styles.name}>{org.name}</h1>
                <span className={styles.planBadge} style={{ background: `${planInfo.color}22`, color: planInfo.color, border: `1px solid ${planInfo.color}44` }}>
                  {planInfo.name}
                </span>
              </div>
              <span className={styles.role}>Organización · {org.city || 'Bucaramanga'}</span>
              <p className={styles.quote}>
                Proyectos este mes: <strong>{org.projects_this_month || 0}</strong> / {org.max_projects_monthly}
              </p>
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
                <div className="form-group">
                  <label className="form-label">Nombre de la organización</label>
                  <input className="form-input" value={form.name} onChange={e => set('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <textarea className="form-input" rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="¿A qué se dedica tu organización?" />
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
                  <label className="form-label">Dirección</label>
                  <input className="form-input" value={form.address} onChange={e => set('address', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Sitio web</label>
                  <input className="form-input" type="url" value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="form-label">URL banner (o sube imagen arriba)</label>
                  <input className="form-input" value={form.banner_url} onChange={e => set('banner_url', e.target.value)} placeholder="https://..." />
                </div>
              </div>
            ) : (
              <div className={styles.infoGrid}>
                <div>
                  <h3 className={styles.sectionTitle}>Acerca de la organización</h3>
                  <p className={styles.desc}>{org.description || 'Sin descripción. Edita tu perfil.'}</p>
                  <div className={styles.metaList}>
                    {org.city    && <div className={styles.metaItem}><FiMapPin /> {org.address ? `${org.address}, ` : ''}{org.city}</div>}
                    {org.phone   && <div className={styles.metaItem}><FiPhone /> {org.phone}</div>}
                    {org.website && <div className={styles.metaItem}><FiGlobe /> <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{org.website}</a></div>}
                  </div>
                </div>
                <div>
                  <h3 className={styles.sectionTitle}>Plan actual</h3>
                  <div className={styles.planBox} style={{ '--pc': planInfo.color }}>
                    <div className={styles.planName}>{planInfo.name}</div>
                    <div className={styles.planPrice}>
                      {planInfo.price === 0 ? 'Gratis' : `$${planInfo.price.toLocaleString('es-CO')}/mes`}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8 }}>
                      {org.max_projects_monthly} proyecto(s) por mes
                      {org.can_view_volunteers ? ' · Gestión de voluntarios' : ''}
                      {org.has_dashboard ? ' · Dashboard' : ''}
                      {org.has_ads ? ' · Publicidad' : ''}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
