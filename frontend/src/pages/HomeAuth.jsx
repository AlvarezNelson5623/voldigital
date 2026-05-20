import { useEffect, useState } from 'react'
import { FiSearch, FiArrowRight } from 'react-icons/fi'
import api from '../services/api'
import Sidebar from '../components/layout/Sidebar'
import { useNavigate } from 'react-router-dom'
import ProjectCard from '../components/common/ProjectCard'
import AdvertisementCarousel from '../components/common/AdvertisementCarousel'
import { useAuth } from '../context/AuthContext'
import styles from './Home.module.css'

export default function HomeAuth() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [ads, setAds] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <section className={styles.authHero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroContent}>
              <h1 className={styles.authTitle}>Hola, {user?.profile?.name || user?.name}</h1>
              <p className={styles.heroSub}>Estas viendo las últimas publicaciones y las publicidades destacadas.</p>
            </div>
            <div className={styles.heroMedia}>
              {ads.length > 0 && <AdvertisementCarousel ads={ads} />}
            </div>
          </div>
        </section>

        <section className={styles.feedSection}>
          <div className={styles.feedHeader}>
            <h2>Feed</h2>
            <p>Publicaciones de organizaciones y oportunidades para postularte.</p>
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
                <div key={i} className="card" style={{ height: 320 }} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <FiSearch size={48} />
              <p>No se encontraron publicaciones</p>
            </div>
          ) : (
            <div className="projects-grid">
              {filtered.map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onClick={(proj) => {
                    const role = user?.profile?.role || user?.role
                    if (role === 'organization') navigate('/organizacion/proyectos')
                    else if (role === 'volunteer') navigate('/voluntario/proyectos')
                    else navigate('/')
                  }}
                />
              ))}
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <div className="container">
            <span>VolDigital © {new Date().getFullYear()} — Conectando voluntades en Bucaramanga</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
