import { Link } from 'react-router-dom'
import { ROUTES } from '../../../../constants/routes'
import styles from './FavoritesEmptyState.module.css'

const EXAMPLE_PROFILES = [
  { id: 'ex1', name: 'Avto Market', ads: 24, initial: 'AM' },
  { id: 'ex2', name: 'Tech Store', ads: 12, initial: 'TS' },
  { id: 'ex3', name: 'Home Goods', ads: 8, initial: 'HG' },
]

const EXAMPLE_ADS = [
  { id: 'a1', title: 'iPhone 15 Pro', price: '12 000 000 сум' },
  { id: 'a2', title: 'Toyota Camry', price: '28 500 USD' },
  { id: 'a3', title: 'Диван угловой', price: '4 200 000 сум' },
]

/**
 * Пустое избранное: текст + пример карточек (как будет выглядеть список).
 */
export default function FavoritesEmptyState({ variant = 'ads', t }) {
  const isProfiles = variant === 'profiles'

  return (
    <div className={styles.wrap}>
      <div className={styles.message}>
        <span className={styles.icon} aria-hidden>
          <i className={isProfiles ? 'bi bi-person-heart' : 'bi bi-heart'} />
        </span>
        <h2 className={styles.title}>
          {isProfiles ? t('favorites.profilesEmptyTitle') : t('favorites.emptyTitle')}
        </h2>
        <p className={styles.text}>
          {isProfiles ? t('favorites.profilesEmptyText') : t('favorites.emptyText')}
        </p>
        <Link to={ROUTES.HOME} className={styles.cta}>
          {t('home.viewAds')}
        </Link>
      </div>

      <div className={styles.example} aria-hidden>
        <p className={styles.exampleLabel}>{t('favorites.emptyExample')}</p>
        {isProfiles ? (
          <ul className={styles.profileList}>
            {EXAMPLE_PROFILES.map((p) => (
              <li key={p.id} className={styles.profileCard}>
                <span className={styles.avatar}>{p.initial}</span>
                <span className={styles.profileBody}>
                  <span className={styles.profileName}>{p.name}</span>
                  <span className={styles.profileMeta}>
                    {p.ads} {t('ads.sellerAds')}
                  </span>
                </span>
                <span className={styles.fakeBtn}>{t('ads.youAreSubscribed')}</span>
              </li>
            ))}
          </ul>
        ) : (
          <ul className={styles.adGrid}>
            {EXAMPLE_ADS.map((ad) => (
              <li key={ad.id} className={styles.adCard}>
                <span className={styles.adImage}>
                  <i className="bi bi-image" />
                </span>
                <span className={styles.adTitle}>{ad.title}</span>
                <span className={styles.adPrice}>{ad.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
