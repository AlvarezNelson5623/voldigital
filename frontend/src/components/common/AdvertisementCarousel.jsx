import { useState, useEffect } from 'react'
import styles from './AdvertisementCarousel.module.css'

export default function AdvertisementCarousel({ ads }) {
  const [current, setCurrent] = useState(0)
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    if (ads.length <= 1) return
    const t = setInterval(() => setCurrent(c => (c + 1) % ads.length), 5000)
    return () => clearInterval(t)
  }, [ads.length])

  if (!ads || ads.length === 0) return null

  const ad = ads[preview ?? current]

  return (
    <div className={styles.wrapper}>
      <div className={styles.label}>Destacado</div>
      <a href={ad.link_url || '#'} target="_blank" rel="noopener noreferrer" className={styles.link}>
        <div
          className={`${styles.media} ${preview !== null ? styles.previewing : ''}`}
          style={ad.image_url ? { backgroundImage: `url(${ad.image_url})` } : {}}
        >
          <img src={ad.image_url} alt={ad.title || ad.org_name} className={styles.image} />
        </div>

        {/* org badge top-left */}
        <div className={styles.orgBadge}>
          {ad.avatar_url && <img src={ad.avatar_url} alt="" className={styles.orgAvatar} />}
          <span className={styles.orgName}>{ad.org_name}</span>
        </div>

        {/* bottom overlay */}
        <div className={styles.overlay}>
          <div className={styles.leftCol}>
            <div className={styles.leftColInner}>
              {ad.title && <h2 className={styles.title} title={ad.title}>{ad.title}</h2>}
              {ad.description && <p className={styles.tagline}>{ad.description}</p>}
            </div>
          </div>

          <div className={styles.rightCol}>
            <div className={styles.miniStrip}>
              {ads.map((x, i) => (
                <img
                  key={i}
                  src={x.image_url}
                  alt={x.title || x.org_name}
                  className={`${styles.miniThumb} ${i === current ? styles.miniActive : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Mostrar anuncio ${i + 1} de ${ads.length} - ${x.org_name}`}
                  onClick={() => setCurrent(i)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCurrent(i) } }}
                  onMouseEnter={() => setPreview(i)}
                  onMouseLeave={() => setPreview(null)}
                />
              ))}
            </div>
          </div>
        </div>
      </a>

      {ads.length > 1 && (
        <div className={styles.dots}>
          {ads.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === current ? styles.active : ''}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
