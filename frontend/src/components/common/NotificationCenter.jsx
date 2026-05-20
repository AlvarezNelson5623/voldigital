import { useState, useEffect, useRef } from 'react'
import { FiBell, FiCheck, FiCheckCircle, FiX, FiAward, FiUserPlus, FiInfo } from 'react-icons/fi'
import api from '../../services/api'
import styles from './NotificationCenter.module.css'

const TYPE_ICONS = {
  application_accepted: <FiCheckCircle size={18} style={{ color: 'var(--primary)' }} />,
  application_rejected: <FiX size={18} style={{ color: '#EF4444' }} />,
  project_completed:    <FiAward size={18} style={{ color: '#F59E0B' }} />,
  new_application:      <FiUserPlus size={18} style={{ color: 'var(--secondary)' }} />,
  general:              <FiInfo size={18} style={{ color: 'var(--text-3)' }} />,
}

export default function NotificationCenter() {
  const [open, setOpen]     = useState(false)
  const [data, setData]     = useState({ notifications: [], unread: 0 })
  const ref                 = useRef(null)
  const btnRef              = useRef(null)
  const dropdownRef        = useRef(null)
  const [posStyle, setPosStyle] = useState(null)

  const load = async () => {
    try {
      const res = await api.get('/notifications')
      setData(res.data)
    } catch {}
  }

  useEffect(() => { load() }, [])

  // Poll each 30s
  useEffect(() => {
    const interval = setInterval(load, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Position dropdown as fixed to escape sidebar clipping
  useEffect(() => {
    if (!open) { setPosStyle(null); return }
    const updatePos = () => {
      const btn = btnRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      const windowSafeWidth = Math.min(360, window.innerWidth - 24)

      // try to keep dropdown inside nearest sidebar if exists
      let ancestor = btn.parentElement
      while (ancestor) {
        if (ancestor.classList && ancestor.className && ancestor.className.toString().includes('sidebar')) break
        ancestor = ancestor.parentElement
      }

      let width = windowSafeWidth
      let left = Math.max(12, r.right - width)

      if (ancestor) {
        const sideR = ancestor.getBoundingClientRect()
        // match dropdown width to sidebar width (minus small padding) so it aligns with menu
        const sideInnerWidth = Math.max(160, sideR.width - 16)
        width = Math.min(sideInnerWidth, windowSafeWidth)
        left = sideR.left + 8
      }

      let top = r.bottom + 10
      // set initial style so we can measure dropdown size
      setPosStyle({ position: 'fixed', top: `${top}px`, left: `${left}px`, width: `${width}px` })
      // measure dropdown and adjust if it overflows bottom
      requestAnimationFrame(() => {
        const dd = dropdownRef.current
        if (!dd) return
        const dr = dd.getBoundingClientRect()
        if (dr.bottom > window.innerHeight - 12) {
          // place above the button if not enough space below
          const altTop = r.top - dr.height - 10
          const finalTop = Math.max(12, altTop)
          setPosStyle(ps => ({ ...ps, top: `${finalTop}px` }))
        }
      })
    }
    updatePos()
    window.addEventListener('resize', updatePos)
    window.addEventListener('scroll', updatePos, true)
    return () => { window.removeEventListener('resize', updatePos); window.removeEventListener('scroll', updatePos, true) }
  }, [open])

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`)
    setData(d => ({
      ...d,
      notifications: d.notifications.map(n => n.id === id ? { ...n, read_status: 1 } : n),
      unread: Math.max(0, d.unread - 1)
    }))
  }

  const markAllRead = async () => {
    await api.put('/notifications/read-all')
    setData(d => ({
      notifications: d.notifications.map(n => ({ ...n, read_status: 1 })),
      unread: 0
    }))
  }

  const fmt = (d) => {
    const diff = Date.now() - new Date(d).getTime()
    if (diff < 60000) return 'Ahora'
    if (diff < 3600000) return `${Math.floor(diff/60000)}m`
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h`
    return new Date(d).toLocaleDateString('es-CO', { day:'2-digit', month:'short' })
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <button ref={btnRef} className={styles.bell} onClick={() => { setOpen(o => !o); if (!open) load() }}>
        <FiBell size={20} />
        {data.unread > 0 && <span className={styles.badge}>{data.unread > 9 ? '9+' : data.unread}</span>}
      </button>

      {open && (
        <div ref={dropdownRef} className={`card ${styles.dropdown}`} style={posStyle || {}}>
          <div className={styles.header}>
            <span className={styles.headerTitle}>Notificaciones</span>
            {data.unread > 0 && (
              <button className={`btn btn-ghost btn-sm ${styles.markAll}`} onClick={markAllRead}>
                <FiCheck size={14} /> Marcar todas
              </button>
            )}
          </div>

          <div className={styles.list}>
            {data.notifications.length === 0 && (
              <div className={styles.empty}>
                <FiCheckCircle size={32} style={{ color: 'var(--text-3)' }} />
                <p>Sin notificaciones</p>
              </div>
            )}
            {data.notifications.map(n => (
              <div
                key={n.id}
                className={`${styles.item} ${!n.read_status ? styles.unread : ''}`}
                onClick={() => !n.read_status && markRead(n.id)}
              >
                <span className={styles.icon}>{TYPE_ICONS[n.type] || <FiInfo size={18} style={{ color: 'var(--text-3)' }} />}</span>
                <div className={styles.content}>
                  <p className={styles.notifTitle}>{n.title}</p>
                  <p className={styles.msg}>{n.message}</p>
                  <span className={styles.time}>{fmt(n.created_at)}</span>
                </div>
                {!n.read_status && <span className="notif-dot" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
