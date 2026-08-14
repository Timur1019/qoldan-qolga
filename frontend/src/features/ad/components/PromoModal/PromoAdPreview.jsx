import styles from './PromoAdPreview.module.css'

function formatPrice(price, currency = 'UZS') {
  if (price == null) return ''
  return `${Number(price).toLocaleString('ru-RU')} ${currency}`
}

export default function PromoAdPreview({ ad }) {
  if (!ad) return null
  const image = ad.mainImageUrl || ad.imageUrls?.[0]

  return (
    <div className={styles.preview}>
      <div className={styles.thumb} aria-hidden>
        {image ? (
          <img src={image} alt="" className={styles.img} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.meta}>
        <p className={styles.title}>{ad.title}</p>
        <p className={styles.price}>{formatPrice(ad.price, ad.currency)}</p>
      </div>
    </div>
  )
}
