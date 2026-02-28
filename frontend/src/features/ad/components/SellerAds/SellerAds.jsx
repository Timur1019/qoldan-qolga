import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../../../context/LangContext'
import CardGallery from '../CardGallery'
import { adsPath } from '../../../../constants/routes'
import { formatPrice } from '../../utils/adFormatters'
import styles from './SellerAds.module.css'

function SellerAds({ ads = [], titleKey = 'ads.sellerAdsTitle' }) {
  const { t } = useLang()

  if (ads.length === 0) return null

  return (
    <section className={`${styles.wrap} mt-4`}>
      <h2 className="h5 mb-3">{t(titleKey)}</h2>
      <ul className={styles.grid}>
        {ads.map((item) => (
          <li key={item.id} className={`${styles.card} app-card app-card-hover`}>
            <Link to={adsPath(item.id)} className={styles.cardLink}>
              <span className={styles.cardImageWrap}>
                <span className={`badge position-absolute top-0 start-0 m-2 ${item.sellerIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.7rem' }}>
                  {item.sellerIsStore ? 'Магазин' : 'Частный'}
                </span>
                <CardGallery
                  imageUrls={item.imageUrls ?? (item.mainImageUrl ? [item.mainImageUrl] : [])}
                />
              </span>
              <div className={styles.cardBody}>
                <p className={styles.cardPrice}>
                  {formatPrice(item.price, item.currency)}
                  {item.isNegotiable && ` (${t('ads.negotiable')})`}
                </p>
                <h2 className={styles.cardTitle}>{item.title}</h2>
                {(item.region || item.category) && (
                  <p className={styles.cardMeta}>
                    {item.category}
                    {item.region && ` · ${item.region}`}
                  </p>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default memo(SellerAds)
