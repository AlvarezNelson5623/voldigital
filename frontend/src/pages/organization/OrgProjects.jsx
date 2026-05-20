import { useState, useEffect } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiCheck, FiX, FiClipboard, FiUpload, FiMapPin } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import TagBadge from '../../components/common/TagBadge'
import { PROJECT_STATUS } from '../../utils/constants'
import toast from 'react-hot-toast'
import styles from './OrgProjects.module.css'

const EMPTY_FORM = { title: '', description: '', image_url: '', location: '', max_volunteers: '', start_date: '', end_date: '', tagIds: [] }

export default function OrgProjects() {
  const { user } = useAuth()
  const org      = user?.profile
  const [projects, setProjects] = useState([])
  const [allTags, setAllTags]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null) // null | 'create' | 'edit' | 'applicants'
  const [form, setForm]         = useState(EMPTY_FORM)
  const [editId, setEditId]     = useState(null)
  const [applicants, setApplicants] = useState([])
  const [appProject, setAppProject] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!org?.id) return
    Promise.all([
      api.get(`/projects/organization/${org.id}`),
      api.get('/tags')
    ]).then(([p, t]) => { setProjects(p.data); setAllTags(t.data) })
      .finally(() => setLoading(false))
  }, [org?.id])

  const refresh = () => api.get(`/projects/organization/${org.id}`).then(r => setProjects(r.data))

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toggleTag = (id) => setForm(f => ({
    ...f, tagIds: f.tagIds.includes(id) ? f.tagIds.filter(t => t !== id) : [...f.tagIds, id]
  }))

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

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setModal('create') }
  const openEdit = (p) => {
    setForm({
      title: p.title, description: p.description, image_url: p.image_url || '',
      location: p.location || '', max_volunteers: p.max_volunteers || '',
      start_date: p.start_date?.slice(0,10) || '', end_date: p.end_date?.slice(0,10) || '',
      tagIds: p.tags ? p.tags.split(',').map(n => allTags.find(t => t.name === n)?.id).filter(Boolean) : []
    })
    setEditId(p.id); setModal('edit')
  }

  const openApplicants = async (p) => {
    setAppProject(p)
    const res = await api.get(`/applications/project/${p.id}`)
    // Normalizar: el backend devuelve `status` mientras que otras APIs usan `application_status`
    setApplicants(res.data.map(a => ({ ...a, application_status: a.application_status || a.status })))
    setModal('applicants')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'create') {
        await api.post('/projects', form)
        toast.success('Proyecto creado')
      } else {
        await api.put(`/projects/${editId}`, form)
        toast.success('Proyecto actualizado')
      }
      setModal(null)
      await refresh()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al guardar')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este proyecto?')) return
    await api.delete(`/projects/${id}`)
    toast.success('Proyecto eliminado')
    refresh()
  }

  const handleComplete = async (id) => {
    if (!confirm('¿Marcar este proyecto como completado? Se generarán certificados para los voluntarios aceptados.')) return
    try {
      const res = await api.put(`/projects/${id}/complete`)
      toast.success(res.data.message)
      refresh()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error')
    }
  }

  const handleApplication = async (appId, status) => {
    try {
      await api.put(`/applications/${appId}`, { status })
      toast.success(status === 'accepted' ? 'Voluntario aceptado' : 'Postulación rechazada')
      const res = await api.get(`/applications/project/${appProject.id}`)
      setApplicants(res.data.map(a => ({ ...a, application_status: a.application_status || a.status })))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error')
    }
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Proyectos</h1>
            <p style={{ color: 'var(--text-2)', marginTop: 4, fontSize: 14 }}>
              {projects.length} proyecto(s) · {org?.projects_this_month || 0}/{org?.max_projects_monthly} este mes
            </p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>
            <FiPlus /> Nuevo proyecto
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 'var(--radius)' }} />)}
          </div>
          ) : projects.length === 0 ? (
          <div className={styles.empty}>
            <FiClipboard size={48} style={{ color: 'var(--text-3)' }} />
            <h3>Sin proyectos aún</h3>
            <p>Crea tu primer proyecto para conectar con voluntarios</p>
            <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Crear proyecto</button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {projects.map(p => {
              const st = PROJECT_STATUS[p.status] || PROJECT_STATUS.recruiting
              const tags = p.tags ? p.tags.split(',').filter(Boolean) : []
                return (
                <div key={p.id} className={`card ${styles.projCard}`}>
                  {p.image_url && <div className={styles.projImg} style={{ backgroundImage: `url(${p.image_url})` }} />}
                  <div className={styles.projBody}>
                    <div className={styles.projTop}>
                      <span className={`badge ${st.badge}`}>{st.label}</span>
                      <h3 className={styles.projTitle}>{p.title}</h3>
                    </div>
                    <p className={styles.projDesc}>{p.description?.slice(0, 120)}{p.description?.length > 120 ? '…' : ''}</p>
                    <div className={styles.projMeta}>
                      <span><FiUsers size={13}/> {p.accepted_count || 0} aceptados · {p.pending_count || 0} pendientes</span>
                      {tags.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          {tags.slice(0,3).map((t,i) => <TagBadge key={i} name={t} size="sm" />)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.projActions}>
                    <button className="btn btn-ghost btn-sm" onClick={() => openApplicants(p)} title="Ver postulantes">
                      <FiUsers size={14} />
                    </button>
                    <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)} title="Editar">
                      <FiEdit2 size={14} />
                    </button>
                    {p.status !== 'completed' && p.status !== 'cancelled' && (
                      <button className="btn btn-secondary btn-sm" onClick={() => handleComplete(p.id)} title="Completar">
                        <FiCheck size={14} />
                      </button>
                    )}
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)} title="Eliminar">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Create/Edit Modal */}
        {(modal === 'create' || modal === 'edit') && (
          <div className={styles.overlay} onClick={() => setModal(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>{modal === 'create' ? 'Nuevo proyecto' : 'Editar proyecto'}</h2>
                <button className={styles.closeBtn} onClick={() => setModal(null)}><FiX /></button>
              </div>
              <form onSubmit={handleSave} className={styles.modalForm}>
                <div className="form-group">
                  <label className="form-label">Título *</label>
                  <input className="form-input" required value={form.title} onChange={e => set('title', e.target.value)} placeholder="Nombre del proyecto" />
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción *</label>
                  <textarea className="form-input" required rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="¿En qué consiste este proyecto?" />
                </div>
                <div className="form-group">
                  <label className="form-label">Imagen del proyecto</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <input className="form-input" value={form.image_url} onChange={e => set('image_url', e.target.value)} placeholder="URL de la imagen" style={{ flex: 1 }} />
                    <label className="btn btn-outline btn-sm" style={{ cursor: 'pointer', flexShrink: 0 }}>
                      {uploading ? 'Subiendo…' : <><FiUpload style={{ marginRight: 8 }} />Subir</>}
                      <input type="file" accept="image/*" style={{ display: 'none' }}
                        onChange={e => e.target.files[0] && uploadImage(e.target.files[0])} />
                    </label>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Ubicación</label>
                    <input className="form-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Ej: Centro, Bucaramanga" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Máx. voluntarios</label>
                    <input className="form-input" type="number" min={1} value={form.max_volunteers} onChange={e => set('max_volunteers', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha inicio</label>
                    <input className="form-input" type="date" value={form.start_date} onChange={e => set('start_date', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fecha fin</label>
                    <input className="form-input" type="date" value={form.end_date} onChange={e => set('end_date', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Etiquetas (para emparejamiento)</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {allTags.map(t => (
                      <TagBadge key={t.id} name={t.name} color={t.color}
                        selected={form.tagIds.includes(t.id)} onClick={() => toggleTag(t.id)} />
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? 'Guardando…' : modal === 'create' ? 'Crear proyecto' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Applicants Modal */}
        {modal === 'applicants' && (
          <div className={styles.overlay} onClick={() => setModal(null)}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h2>Postulantes — {appProject?.title}</h2>
                <button className={styles.closeBtn} onClick={() => setModal(null)}><FiX /></button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: '60vh', overflowY: 'auto' }}>
                {applicants.length === 0 && <p style={{ color: 'var(--text-2)', textAlign: 'center', padding: 30 }}>Sin postulantes aún</p>}
                {applicants.map(a => (
                  <div key={a.id} className={`card ${styles.applicantCard}`}>
                    <img
                      src={a.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(`${a.name} ${a.last_name}`)}&background=6C63FF&color=fff`}
                      alt="" className={styles.appAvatar}
                    />
                    <div className={styles.appInfo}>
                      <p className={styles.appName}>{a.name} {a.last_name}</p>
                      {a.city && <p style={{ fontSize: 12, color: 'var(--text-2)' }}><FiMapPin style={{ marginRight: 8 }} /> {a.city}</p>}
                      {a.bio && <p style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>{a.bio?.slice(0,80)}{a.bio?.length > 80 ? '…' : ''}</p>}
                      {a.tags && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                          {a.tags.split(',').slice(0,3).map((t,i) => <TagBadge key={i} name={t} size="sm" />)}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                      <span className={`badge badge-${a.application_status}`} style={{ textAlign: 'center' }}>
                        {a.application_status === 'pending' ? 'Pendiente' : a.application_status === 'accepted' ? 'Aceptado' : 'Rechazado'}
                      </span>
                      {a.application_status === 'pending' && (
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleApplication(a.id, 'accepted')}>✓</button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleApplication(a.id, 'rejected')}>✗</button>
                        </div>
                      )}

                      {/* WhatsApp contact button - available if volunteer provided phone */}
                      {(() => {
                        const phone = a.phone || a.phone_number || a.user_phone || a.contact_phone
                        if (!phone) return null
                        const normalize = (p) => p.replace(/[^0-9]/g, '').replace(/^0+/, '')
                        const np = normalize(phone)
                        const text = encodeURIComponent(`Hola ${a.name}, te contacta ${org?.name || 'la organización'}.`)
                        const wa = `https://wa.me/${np}?text=${text}`
                        return (
                          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" title="Contactar por WhatsApp" style={{ marginTop: 6 }} onClick={(e) => e.stopPropagation()}>
                            <FaWhatsapp style={{ color: '#25D366', marginRight: 6 }} /> WhatsApp
                          </a>
                        )
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
