import { useState, useEffect } from 'react'
import { FiPlus, FiImage, FiClock, FiX, FiUpload, FiSend } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import toast from 'react-hot-toast'
import styles from './OrgAdvertisement.module.css'

export default function OrgAdvertisement() {
  const { user } = useAuth()
  const org      = user?.profile
  const [ads, setAds]       = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingAd, setEditingAd] = useState(null)
  const [tick, setTick] = useState(0)
  const [form, setForm]     = useState({ image_url: '', title: '', link_url: '' })

  const load = () => {
    if (!org?.id) return
    api.get(`/advertisements/organization/${org.id}`)
      .then(r => {
        // initialize client-side edit_seconds_left for ticking
        const list = r.data.map(a => ({ ...a, edit_seconds_left: a.edit_seconds || 0 }))
        setAds(list)
      })
      .finally(() => setLoading(false))
  }
  useEffect(() => { load() }, [org?.id])

  // simple tick to update edit_seconds_left every second
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!ads.length) return
    setAds(prev => prev.map(a => ({ ...a, edit_seconds_left: Math.max(0, (a.edit_seconds_left || 0) - 1) })))
  }, [tick])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const uploadImage = async (file) => {
    setUploading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      set('image_url', res.data.url)
      toast.success('Imagen subida')
    } catch { toast.error('Error al subir imagen') }
    finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.image_url) { toast.error('Debes agregar una imagen'); return }
    setSaving(true)
    try {
      if (editingAd) {
        await api.put(`/advertisements/${editingAd.id}`, form)
        toast.success('Anuncio actualizado')
      } else {
        await api.post('/advertisements', form)
        toast.success('Anuncio publicado. Durará 5 días en el home.')
      }
      setModal(false)
      setForm({ image_url: '', title: '', link_url: '' })
      setEditingAd(null)
      load()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear anuncio')
    } finally { setSaving(false) }
  }

    const handleDelete = async (ad) => {
      if (!window.confirm('¿Eliminar este anuncio? Seguirá contando como publicación.')) return
      try {
        await api.delete(`/advertisements/${ad.id}`)
        toast.success('Anuncio eliminado')
        load()
      } catch (err) {
        toast.error(err.response?.data?.error || 'Error al eliminar')
      }
    }

  const activeAds = ads.filter(a => a.is_active)
  const recentCount = ads.filter(a => new Date(a.start_date) > new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)).length
  const canCreate = recentCount < 2

  const daysLeft = (endDate) => {
    const diff = new Date(endDate) - new Date()
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className={styles.topBar}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Publicidad</h1>
            <p style={{ color: 'var(--text-2)', marginTop: 4, fontSize: 14 }}>
              Tienes 2 slots de 5 días. Activos: {activeAds.length}/2
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setModal(true)} disabled={!canCreate}>
            <FiPlus /> Publicar anuncio
          </button>
        </div>

        {!canCreate && (
          <div className={styles.warningBox}>
            <FiClock size={16} />
            <span>Tienes 2 anuncios activos. Espera a que expiren para publicar uno nuevo.</span>
          </div>
        )}

        {/* Info box */}
        <div className={styles.infoBox}>
          <FiImage size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <div>
            <strong>¿Cómo funciona la publicidad Enterprise?</strong>
            <p>Tu imagen aparece en un carrusel destacado en el home público de VolDigital, antes que todos los proyectos. Si otra organización Enterprise también tiene publicidad activa, ambas imágenes rotan en el carrusel. Cada anuncio dura <strong>5 días</strong>.</p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(2)].map((_, i) => <div key={i} className="skeleton" style={{ height: 180, borderRadius: 'var(--radius)' }} />)}
          </div>
        ) : ads.length === 0 ? (
          <div className={styles.empty}>
            <FiImage size={48} style={{ color: 'var(--text-3)' }} />
            <h3>Sin anuncios aún</h3>
            <p>Publica tu primer anuncio para aparecer destacado en el home</p>
            <button className="btn btn-primary" onClick={() => setModal(true)}><FiPlus /> Publicar anuncio</button>
          </div>
        ) : (
          <div className={styles.adGrid}>
            {ads.map(ad => (
              <div key={ad.id} className={`card ${styles.adCard} ${!ad.is_active ? styles.expired : ''}`}>
                <img src={ad.image_url} alt={ad.title || 'Anuncio'} className={styles.adImage} />
                <div className={styles.adInfo}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 className={styles.adTitle}>{ad.title || 'Sin título'}</h3>
                    <span className={`badge ${ad.is_active ? 'badge-active' : 'badge-cancelled'}`}>
                      {ad.is_active ? 'Activo' : 'Expirado'}
                    </span>
                  </div>
                  {ad.link_url && (
                    <a href={ad.link_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: 13, color: 'var(--primary)' }}>
                      {ad.link_url}
                    </a>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                    {ad.edit_seconds_left > 0 && (
                      <span style={{ fontSize: 13, color: 'var(--muted)' }}>Tiempo para editar: {new Date(ad.edit_seconds_left * 1000).toISOString().substr(14, 5)}</span>
                    )}
                    {ad.is_active && (
                      <>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditingAd(ad); setForm({ image_url: ad.image_url, title: ad.title || '', link_url: ad.link_url || '' }); setModal(true) }}>
                          Editar
                        </button>
                        <button className="btn btn-outline btn-sm" onClick={() => handleDelete(ad)}>
                          Eliminar
                        </button>
                      </>
                    )}
                  </div>
                  <div className={styles.adMeta}>
                    <span><FiClock size={13} /> {ad.is_active ? `${daysLeft(ad.end_date)} días restantes` : 'Expirado'}</span>
                    <span>Publicado: {new Date(ad.start_date).toLocaleDateString('es-CO', { day:'2-digit', month:'short' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create modal */}
        {modal && (
          <div className={styles.overlay} onClick={() => { setModal(false); setEditingAd(null); }}>
            <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{editingAd ? 'Editar anuncio' : 'Publicar anuncio'}</h2>
                <button onClick={() => { setModal(false); setEditingAd(null); setForm({ image_url: '', title: '', link_url: '' }) }} style={{ background: 'transparent', color: 'var(--text-2)' }}><FiX /></button>
              </div>
              <form onSubmit={handleSave} className={styles.modalForm}>
                <div className="form-group">
                  <label className="form-label">Imagen del anuncio *</label>
                  <p style={{ fontSize: 12, color: 'var(--text-2)', marginBottom: 8 }}>
                    Esta imagen aparecerá en el carrusel del home. Recomendado: 1200×420px.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="form-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="URL de la imagen" style={{ flex: 1 }} />
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', flexShrink: 0 }}>
                        {uploading ? 'Subiendo…' : <><FiUpload style={{ marginRight: 8 }} />Subir</>}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                    </label>
                  </div>
                  {form.image_url && (
                    <img src={form.image_url} alt="" className={styles.previewImg} />
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">Título / eslogan (opcional)</label>
                  <input className="form-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Únete a nuestra causa" />
                </div>
                <div className="form-group">
                  <label className="form-label">Enlace al hacer clic (opcional)</label>
                  <input className="form-input" type="url" value={form.link_url} onChange={e => set('link_url', e.target.value)} placeholder="https://..." />
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => { setModal(false); setEditingAd(null); }}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={saving || !form.image_url}>
                    {saving ? (editingAd ? 'Guardando…' : 'Publicando…') : (editingAd ? 'Guardar cambios' : <><FiSend style={{ marginRight: 8 }} /> Publicar (5 días)</>)}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
