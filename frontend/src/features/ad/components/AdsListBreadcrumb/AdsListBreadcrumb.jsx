import { Link } from 'react-router-dom'
import CategoryIcon from '../../../../components/ui/CategoryIcon'
import { ROUTES, adsCategoryPathWithParams } from '../../../../constants/routes'

export default function AdsListBreadcrumb({
  categoryBreadcrumb,
  currentCategory,
  categoryName,
  searchParams,
  t,
}) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb mb-2 mb-md-3">
        <li className="breadcrumb-item">
          <Link to={ROUTES.HOME}>{t('nav.home')}</Link>
        </li>
        {categoryBreadcrumb.length > 0 ? (
          categoryBreadcrumb.map((crumb, i) => {
            const isLast = i === categoryBreadcrumb.length - 1
            return (
              <li key={crumb.code} className={`breadcrumb-item ${isLast ? 'active' : ''}`} aria-current={isLast ? 'page' : undefined}>
                {isLast ? (
                  <span className="d-inline-flex align-items-center gap-1">
                    <CategoryIcon code={crumb.code} parentCode={crumb.parentCode} />
                    {categoryName(crumb)}
                  </span>
                ) : (
                  <Link to={adsCategoryPathWithParams(crumb.code, searchParams)} className="d-inline-flex align-items-center gap-1">
                    <CategoryIcon code={crumb.code} parentCode={crumb.parentCode} />
                    {categoryName(crumb)}
                  </Link>
                )}
              </li>
            )
          })
        ) : (
          <li className="breadcrumb-item active" aria-current="page">
            {currentCategory ? (
              <span className="d-inline-flex align-items-center gap-1">
                <CategoryIcon code={currentCategory.code} parentCode={currentCategory.parentCode} />
                {categoryName(currentCategory)}
              </span>
            ) : t('common.loading')}
          </li>
        )}
      </ol>
    </nav>
  )
}
