import { Link } from 'react-router-dom'
import CategoryIcon from '@/components/ui/CategoryIcon'
import { ROUTES } from '@/constants/routes'
import { HOME_BUSINESS_ITEMS } from '../../utils/homeBusinessItems'
import styles from './HomeBusinessPanel.module.css'

/**
 * Боковой блок направлений для магазинов / B2B — свой стиль Qoldan, не копия Avito.
 */
export default function HomeBusinessPanel({ t }) {
  return (
    <aside className={styles.panel} aria-labelledby="home-biz-title">
      <div className={styles.head}>
        <h2 id="home-biz-title" className={styles.title}>{t('home.bizTitle')}</h2>
        <p className={styles.lead}>{t('home.bizLead')}</p>
      </div>

      <ul className={styles.grid}>
        {HOME_BUSINESS_ITEMS.map((item) => (
          <li key={item.id}>
            <Link to={item.to} className={styles.item}>
              <span className={styles.iconWrap} aria-hidden>
                <CategoryIcon code={item.code} className={styles.icon} />
              </span>
              <span className={styles.label}>{t(item.labelKey)}</span>
            </Link>
          </li>
        ))}
      </ul>

      <Link to={ROUTES.BUSINESS} className={styles.cta} title={t('home.bizCta')}>
        <i className="bi bi-shop-window" aria-hidden />
        <span>{t('home.bizCta')}</span>
      </Link>
    </aside>
  )
}
