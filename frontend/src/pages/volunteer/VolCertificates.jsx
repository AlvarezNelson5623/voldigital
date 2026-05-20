import { useState, useEffect, useRef } from 'react'
import { FiDownload, FiAward, FiLock } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import toast from 'react-hot-toast'
import { DOWNLOAD_PRICE } from '../../utils/constants'
import styles from './VolCertificates.module.css'
import logo2 from '../../assets/logo2.png'

export default function VolCertificates() {
  const { user } = useAuth()
  const volId    = user?.profile?.id
  const [certs, setCerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [paying, setPaying]   = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!volId) return
    api.get(`/certificates/volunteer/${volId}`)
      .then(r => setCerts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [volId])

  const handlePay = async (cert) => {
    setPaying(cert.id)
    try {
      await api.post(`/certificates/${cert.id}/pay`)
      toast.success('Pago simulado exitoso ($10.000 COP). ¡Descargando!')
      setCerts(cs => cs.map(c => c.id === cert.id ? { ...c, download_paid: 1 } : c))
      // Slight delay to show success, then download
      setTimeout(() => downloadCertificate(cert), 600)
    } catch (err) {
      toast.error('Error al procesar pago')
    } finally {
      setPaying(null)
    }

  }

  const downloadCertificate = (cert) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1200
    canvas.height = 800
    const ctx = canvas.getContext('2d')

    // Helper: load image as Promise
    const loadImage = (src) => new Promise((resolve) => {
      if (!src) return resolve(null)
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => resolve(img)
      img.onerror = () => resolve(null)
      img.src = src
    })

    // Load logo2 and org avatar, then draw everything and download
    Promise.all([
      loadImage(logo2),
      loadImage(cert.org_avatar)
    ]).then(([logoImg, orgImg]) => {
      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 1200, 800)
      grad.addColorStop(0, '#1E1B4B')
      grad.addColorStop(1, '#4A44CC')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1200, 800)

      // Gold border
      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 8
      ctx.strokeRect(24, 24, 1152, 752)
      ctx.strokeStyle = 'rgba(245,158,11,.3)'
      ctx.lineWidth = 2
      ctx.strokeRect(32, 32, 1136, 736)

      // Draw logo (or fallback emoji)
      ctx.textAlign = 'center'
      if (logoImg) {
        const lw = 140
        const lh = Math.round(logoImg.height * (lw / logoImg.width))
        ctx.drawImage(logoImg, 600 - lw / 2, 40, lw, lh)
      } else {
        // Fallback text when logo is not available
        ctx.font = 'bold 48px sans-serif'
        ctx.fillStyle = '#FFFFFF'
        ctx.fillText('VolDigital', 600, 130)
      }

      // Title & subtitle
      ctx.fillStyle = '#F59E0B'
      ctx.font = 'bold 52px sans-serif'
      ctx.fillText('CERTIFICADO DE VOLUNTARIADO', 600, 210)
      ctx.fillStyle = 'rgba(255,255,255,.7)'
      ctx.font = '26px sans-serif'
      ctx.fillText('VolDigital — Conectando voluntades', 600, 260)

      // Horizontal line
      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(200, 290); ctx.lineTo(1000, 290); ctx.stroke()

      // Body
      ctx.fillStyle = 'rgba(255,255,255,.85)'
      ctx.font = '24px sans-serif'
      ctx.fillText('Se certifica que', 600, 360)
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 44px sans-serif'
      ctx.fillText(`${cert.vol_name} ${cert.vol_last_name}`, 600, 420)
      ctx.fillStyle = 'rgba(255,255,255,.85)'
      ctx.font = '22px sans-serif'
      ctx.fillText('participó satisfactoriamente en el proyecto de voluntariado', 600, 470)
      ctx.fillStyle = '#00D4A3'
      ctx.font = 'bold 36px sans-serif'
      ctx.fillText(`"${cert.project_title}"`, 600, 530)

      // Organization name and date (to the right)
      ctx.fillStyle = 'rgba(255,255,255,.9)'
      ctx.font = '20px sans-serif'
      ctx.fillText(`Organización: ${cert.org_name}`, 720, 580)
      ctx.fillText(`Fecha de emisión: ${new Date(cert.issued_at).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}`, 720, 615)

      // Draw organization avatar left of organization text (adjusted position)
      if (orgImg) {
        const ox = 500, oy = 580, ow = 72
        ctx.save()
        ctx.beginPath()
        ctx.arc(ox, oy, ow / 2, 0, Math.PI * 2)
        ctx.closePath()
        ctx.clip()
        ctx.drawImage(orgImg, ox - ow / 2, oy - ow / 2, ow, ow)
        ctx.restore()
        ctx.strokeStyle = 'rgba(255,255,255,.9)'
        ctx.lineWidth = 3
        ctx.beginPath(); ctx.arc(ox, oy, ow / 2 + 1.5, 0, Math.PI * 2); ctx.stroke()
      }

      // Bottom line and note
      ctx.strokeStyle = '#F59E0B'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(200, 650); ctx.lineTo(1000, 650); ctx.stroke()
      ctx.fillStyle = 'rgba(245,158,11,.7)'
      ctx.font = '16px sans-serif'
      ctx.fillText('Este certificado es una muestra de compromiso y dedicación social', 600, 680)

      // Download
      const link = document.createElement('a')
      link.download = `certificado-voldigital-${cert.project_title.replace(/\s+/g,'-')}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      toast.success('¡Certificado descargado!')
    })
  }

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Mis certificados</h1>
          <p>Insignias por proyectos completados satisfactoriamente</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius)' }} />)}
          </div>
        ) : certs.length === 0 ? (
          <div className={styles.empty}>
            <FiAward size={52} style={{ color: 'var(--text-3)' }} />
            <h3>Sin certificados aún</h3>
            <p>Completa proyectos de voluntariado para recibir tus insignias</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {certs.map(cert => (
              <div key={cert.id} className={`card ${styles.certCard}`}>
                <div className={styles.certIcon}><FiAward /></div>
                <div className={styles.certInfo}>
                  <h3 className={styles.certTitle}>{cert.project_title}</h3>
                  <p className={styles.certOrg}>{cert.org_name}</p>
                  <p className={styles.certDate}>
                    Emitido: {new Date(cert.issued_at).toLocaleDateString('es-CO', { day:'2-digit', month:'long', year:'numeric' })}
                  </p>
                </div>
                <div className={styles.certActions}>
                  {cert.download_paid ? (
                    <button className="btn btn-secondary btn-sm" onClick={() => downloadCertificate(cert)}>
                      <FiDownload size={14} /> Descargar
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handlePay(cert)}
                      disabled={paying === cert.id}
                    >
                      <FiLock size={14} />
                      {paying === cert.id ? 'Procesando…' : `Descargar ($${DOWNLOAD_PRICE.toLocaleString('es-CO')})`}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
