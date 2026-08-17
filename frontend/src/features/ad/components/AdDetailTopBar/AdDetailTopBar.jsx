import { Link } from 'react-router-dom'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import { adsCategoryPath } from '../../../../constants/routes'
import styles from './AdDetailTopBar.module.css'

export default function AdDetailTopBar({
  ad,
  categoryLabel,
  onFavorite,
  t,
}) {
  return (
    <div className={`d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3 ${styles.topBar}`}>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">
          <li className="breadcrumb-item"><Link to="/">{t('nav.home')}</Link></li>
          <li className="breadcrumb-item">
            <Link to={adsCategoryPath(ad.category)} className="d-inline-flex align-items-center gap-1">
              <CategoryIcon code={ad.category} />
              {categoryLabel}
            </Link>
          </li>
          <li className="breadcrumb-item active text-truncate" style={{ maxWidth: '200px' }} aria-current="page">
            {ad.title.length > 50 ? ad.title.slice(0, 50) + '…' : ad.title}
          </li>
        </ol>
      </nav>
      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={onFavorite}
        aria-label={ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
      >
        <i className={`bi ${ad.favorite ? 'bi-heart-fill' : 'bi-heart'} me-1`} aria-hidden />
        {ad.favorite ? t('common.removeFromFavorites') : t('common.addToFavorites')}
      </button>
    </div>
  )
}
