export const PROJECT_STATUS = {
  recruiting: { label: 'Reclutando', badge: 'badge-recruiting' },
  active:     { label: 'Activo',     badge: 'badge-active' },
  completed:  { label: 'Completado', badge: 'badge-completed' },
  cancelled:  { label: 'Cancelado',  badge: 'badge-cancelled' },
}

export const APP_STATUS = {
  pending:  { label: 'Pendiente',  badge: 'badge-pending' },
  accepted: { label: 'Aceptado',   badge: 'badge-accepted' },
  rejected: { label: 'Rechazado',  badge: 'badge-rejected' },
}

export const PLANS = {
  1: { name: 'Gratis',       color: '#6B7280', price: 0 },
  2: { name: 'Starter',      color: '#3B82F6', price: 30000 },
  3: { name: 'Professional', color: '#8B5CF6', price: 70000 },
  4: { name: 'Enterprise',   color: '#F59E0B', price: 150000 },
}

export const DOWNLOAD_PRICE = 10000

export const PLAN_FEATURES = [
  { feature: 'Crear proyectos',      free:'1/mes', starter:'10/mes', pro:'20/mes', enterprise:'50/mes' },
  { feature: 'Gestión de voluntarios', free:'✗',   starter:'✓',    pro:'✓',      enterprise:'✓' },
  { feature: 'Dashboard analítico',  free:'✗',    starter:'✗',    pro:'✓',      enterprise:'✓' },
  { feature: 'Publicidad (2 slots)', free:'✗',    starter:'✗',    pro:'✗',      enterprise:'✓' },
]
