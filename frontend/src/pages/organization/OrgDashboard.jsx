import { useState, useEffect } from 'react'
import { FiBarChart2, FiUsers, FiBriefcase, FiCheckCircle, FiClock } from 'react-icons/fi'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { useAuth } from '../../context/AuthContext'
import api from '../../services/api'
import Sidebar from '../../components/layout/Sidebar'
import styles from './OrgDashboard.module.css'

const COLORS = ['#6C63FF', '#00D4A3', '#FF6584', '#F59E0B', '#3B82F6']

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className={`card ${styles.statCard}`}>
    <div className={styles.statIcon} style={{ background: `${color}22`, color }}>
      <Icon size={22} />
    </div>
    <div>
      <p className={styles.statLabel}>{label}</p>
      <p className={styles.statValue}>{value}</p>
    </div>
  </div>
)

export default function OrgDashboard() {
  const { user }  = useAuth()
  const org       = user?.profile
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!org?.id) return
    api.get(`/organizations/${org.id}/dashboard`)
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [org?.id])

  if (loading) return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header"><h1>Dashboard</h1></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 'var(--radius)' }} />)}
        </div>
      </main>
    </div>
  )

  const p = data?.projects || {}
  const v = data?.volunteers || {}

  const pieData = [
    { name: 'Reclutando', value: p.recruiting || 0 },
    { name: 'Activos',    value: p.active     || 0 },
    { name: 'Completados',value: p.completed  || 0 },
    { name: 'Cancelados', value: p.cancelled  || 0 },
  ].filter(d => d.value > 0)

  const barData = (data?.byMonth || []).map(m => ({
    mes: m.month.slice(5), // MM
    proyectos: Number(m.count)
  })).reverse()

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Análisis de actividad de {org?.name}</p>
        </div>

        {/* Stat cards */}
        <div className={styles.statsGrid}>
          <StatCard icon={FiBriefcase}    label="Total proyectos"    value={p.total     || 0} color="#6C63FF" />
          <StatCard icon={FiClock}        label="En reclutamiento"   value={p.recruiting || 0} color="#3B82F6" />
          <StatCard icon={FiCheckCircle}  label="Completados"        value={p.completed || 0} color="#00D4A3" />
          <StatCard icon={FiUsers}        label="Total voluntarios"  value={v.total_volunteers || 0} color="#F59E0B" />
        </div>

        <div className={styles.chartsGrid}>
          {/* Bar chart — proyectos por mes */}
          <div className={`card ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Proyectos por mes</h3>
            {barData.length === 0 ? (
              <div className={styles.noData}>Sin datos históricos aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--text)' }}
                  />
                  <Bar dataKey="proyectos" fill="#6C63FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie chart — estado de proyectos */}
          <div className={`card ${styles.chartCard}`}>
            <h3 className={styles.chartTitle}>Estado de proyectos</h3>
            {pieData.length === 0 ? (
              <div className={styles.noData}>Sin proyectos aún</div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  />
                  <Legend iconType="circle" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Volunteer stats */}
        <div className={`card ${styles.volStatsCard}`}>
          <h3 className={styles.chartTitle}>Resumen de voluntarios</h3>
          <div className={styles.volStats}>
            <div className={styles.volStat}>
              <span className={styles.volStatValue} style={{ color: '#00D4A3' }}>{v.accepted || 0}</span>
              <span className={styles.volStatLabel}>Aceptados</span>
            </div>
            <div className={styles.volStatDivider} />
            <div className={styles.volStat}>
              <span className={styles.volStatValue} style={{ color: '#F59E0B' }}>{v.pending || 0}</span>
              <span className={styles.volStatLabel}>Pendientes</span>
            </div>
            <div className={styles.volStatDivider} />
            <div className={styles.volStat}>
              <span className={styles.volStatValue} style={{ color: '#EF4444' }}>{v.rejected || 0}</span>
              <span className={styles.volStatLabel}>Rechazados</span>
            </div>
            <div className={styles.volStatDivider} />
            <div className={styles.volStat}>
              <span className={styles.volStatValue} style={{ color: '#6C63FF' }}>{v.total_volunteers || 0}</span>
              <span className={styles.volStatLabel}>Voluntarios únicos</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
