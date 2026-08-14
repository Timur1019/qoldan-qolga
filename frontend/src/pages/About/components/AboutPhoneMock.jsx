import styles from './AboutPhoneMock.module.css'

const CATEGORY_ROWS = [
  { icon: 'bi-phone', uz: 'Elektronika', ru: 'Электроника' },
  { icon: 'bi-car-front', uz: 'Transport', ru: 'Транспорт' },
  { icon: 'bi-house', uz: 'Ko\'chmas mulk', ru: 'Недвижимость' },
  { icon: 'bi-bag', uz: 'Kiyim', ru: 'Одежда' },
  { icon: 'bi-heart', uz: 'Xizmatlar', ru: 'Услуги' },
]

export default function AboutPhoneMock({ variant, lang }) {
  return (
    <div className={styles.phone} aria-hidden>
      <div className={styles.notch} />
      <div className={styles.screen}>
        {variant === 'listing' && (
          <div className={styles.listing}>
            <div className={styles.searchBar} />
            <div className={styles.adCard}>
              <div className={styles.adPhoto} />
              <div className={styles.adMeta}>
                <span className={styles.adPrice}>2 450 000</span>
                <span className={styles.adLine} />
                <span className={styles.adLineShort} />
              </div>
            </div>
            <div className={styles.adCard}>
              <div className={`${styles.adPhoto} ${styles.adPhotoAlt}`} />
              <div className={styles.adMeta}>
                <span className={styles.adPrice}>890 000</span>
                <span className={styles.adLine} />
              </div>
            </div>
          </div>
        )}
        {variant === 'create' && (
          <div className={styles.create}>
            <div className={styles.createTitle} />
            <div className={styles.photoDrop}>
              <i className="bi bi-camera" />
            </div>
            <div className={styles.createLine} />
            <div className={styles.createLineShort} />
            <div className={styles.createBtn} />
          </div>
        )}
        {variant === 'categories' && (
          <div className={styles.categories}>
            <div className={styles.searchBar} />
            {CATEGORY_ROWS.map((row) => (
              <div key={row.icon} className={styles.catRow}>
                <i className={`bi ${row.icon}`} />
                <span>{lang === 'ru' ? row.ru : row.uz}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
