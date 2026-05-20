import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'
import { FiAlertCircle } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 40 }}>
        <FiAlertCircle size={72} />
        <h1 style={{ fontSize: 32, fontWeight: 800 }}>Página no encontrada</h1>
        <p style={{ color: 'var(--text-2)' }}>La ruta que buscas no existe</p>
        <Link to="/" className="btn btn-primary">Volver al inicio</Link>
      </div>
    </div>
  )
}
