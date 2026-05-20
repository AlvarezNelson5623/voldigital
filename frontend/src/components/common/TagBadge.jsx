import styles from './TagBadge.module.css'

export default function TagBadge({ name, color, onClick, selected, size = 'md' }) {
  return (
    <span
      className={`${styles.tag} ${styles[size]} ${selected ? styles.selected : ''} ${onClick ? styles.clickable : ''}`}
      style={{
        '--tag-color': color || '#6C63FF',
        background: selected ? (color || '#6C63FF') : `${color || '#6C63FF'}22`,
        color: selected ? '#fff' : (color || '#6C63FF'),
        border: `1.5px solid ${color || '#6C63FF'}44`,
      }}
      onClick={onClick}
    >
      {name}
    </span>
  )
}
