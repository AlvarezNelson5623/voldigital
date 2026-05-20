import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiSearch, FiArrowRight, FiHeart, FiUsers, FiBriefcase, FiUser, FiLock } from 'react-icons/fi'
import api from '../services/api'
import Navbar from '../components/layout/Navbar'
import ProjectCard from '../components/common/ProjectCard'
import AdvertisementCarousel from '../components/common/AdvertisementCarousel'
import styles from './HomePublic.module.css'

export default function Home() {
  const [projects, setProjects] = useState([])
  const [ads, setAds]           = useState([])
  const [search, setSearch]     = useState('')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/projects'),
      api.get('/advertisements/active'),
    ]).then(([pRes, aRes]) => {
      setProjects(pRes.data)
      setAds(aRes.data)
    }).finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.org_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroPill}>Impacto social digital</span>
            <h1 className={styles.heroTitle}>
              Conecta tu talento<br/>
              con causas que<br/>
              <span className={styles.heroHighlight}>importan</span>
            </h1>
            <p className={styles.heroSub}>
              VolDigital empareja organizaciones con voluntarios usando inteligencia
              de perfil. Encuentra proyectos alineados a tus intereses en Bucaramanga y la región.
            </p>
            <div className={styles.heroCtas}>
              <Link to="/registro" className="btn btn-primary btn-lg">
                Únete gratis <FiArrowRight />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">
                Iniciar sesión
              </Link>
            </div>
          </div>

          <div className={styles.heroStats}>
            {ads && ads.length > 0 ? (
              <AdvertisementCarousel ads={ads} />
            ) : (
              <>
                <div className={styles.stat}>
                  <FiHeart className={styles.statIcon} style={{ color: 'var(--accent)' }} />
                  <strong>Voluntarios</strong>
                  <span>Con propósito</span>
                </div>
                <div className={styles.stat}>
                  <FiUsers className={styles.statIcon} style={{ color: 'var(--secondary)' }} />
                  <strong>ONGs</strong>
                  <span>Con impacto</span>
                </div>
                <div className={styles.stat}>
                  <FiBriefcase className={styles.statIcon} style={{ color: 'var(--primary)' }} />
                  <strong>Proyectos</strong>
                  <span>En ejecución</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <main className={`container ${styles.main}`}>
        {/* Roles banner */}
        <section className={styles.rolesSection}>
          <div className={styles.roleCard} style={{ '--accent-c': 'var(--primary)' }}>
            <FiUser className={styles.roleEmoji} />
            <h3>Soy Voluntario</h3>
            <p>Encuentra proyectos sociales que coincidan con tus habilidades e intereses. 100% gratuito.</p>
            <Link to="/registro?rol=voluntario" className="btn btn-primary">Regístrate gratis</Link>
          </div>
          <div className={styles.roleCard} style={{ '--accent-c': 'var(--secondary)' }}>
            <FiBriefcase className={styles.roleEmoji} />
            <h3>Soy Organización</h3>
            <p>Publica proyectos y conecta con voluntarios calificados. Planes desde $0/mes.</p>
            <Link to="/registro?rol=organizacion" className="btn btn-secondary">Ver planes</Link>
          </div>
        </section>

        {/* Projects feed */}
        <section className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h2>Proyectos activos</h2>
            <p>Explora las iniciativas sociales disponibles. Inicia sesión para postularte.</p>
          </div>

          <div className={styles.searchWrap}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text" placeholder="Buscar proyectos, organizaciones, causas..."
              className={`form-input ${styles.searchInput}`}
              value={search} onChange={e => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="projects-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card" style={{ height: 320 }}>
                  <div className="skeleton" style={{ height: 180 }} />
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div className="skeleton" style={{ height: 16, width: '70%' }} />
                    <div className="skeleton" style={{ height: 12, width: '90%' }} />
                    <div className="skeleton" style={{ height: 12, width: '60%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <FiSearch size={48} />
              <p>No se encontraron proyectos</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
                <div key={p.id} className={styles.lockedCard}>
                  <ProjectCard project={p} />
                  <div className={styles.lockOverlay}>
                    <FiLock size={28} style={{ color: 'var(--text-3)' }} />
                    <p>Inicia sesión para ver más detalles y postularte</p>
                    <Link to="/login" className="btn btn-primary btn-sm">Iniciar sesión</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <span>VolDigital © {new Date().getFullYear()} — Conectando voluntades en Bucaramanga</span>
        </div>
      </footer>
    </div>
  )
}
