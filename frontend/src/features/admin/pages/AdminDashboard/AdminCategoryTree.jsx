import CategoryIcon from '@/components/ui/CategoryIcon'
import styles from './AdminCategoryTree.module.css'

export default function AdminCategoryTree({
  rootCategories,
  getChildren,
  expandedIds,
  onToggle,
  onAddSub,
  lang,
  t,
}) {
  const label = (item) => (lang === 'uz' ? item.nameUz : item.nameRu)

  const renderNode = (item, depth = 0, parentCode = '') => {
    const children = getChildren(item.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedIds.has(item.id)
    return (
      <li key={item.id} className={depth === 0 ? styles.item : styles.subitem}>
        <div className={styles.head}>
          <div className={styles.row}>
            {hasChildren ? (
              <button
                type="button"
                className={styles.toggle}
                onClick={() => onToggle(item.id)}
                title={isExpanded ? t('adminPanel.collapse') : t('adminPanel.expand')}
                aria-expanded={isExpanded}
              >
                <span className={styles.chevron} data-expanded={isExpanded}>▼</span>
              </button>
            ) : (
              <span className={styles.placeholder} />
            )}
            <CategoryIcon code={item.code} parentCode={item.parentCode || parentCode} className={styles.icon} />
            <span className={styles.name}>{label(item)}</span>
            <code className={styles.code}>{item.code}</code>
          </div>
          <button type="button" className={styles.subBtn} onClick={() => onAddSub(item)}>
            {t('adminPanel.addSub')}
          </button>
        </div>
        {hasChildren && isExpanded && (
          <ul className={depth === 0 ? styles.sublist : styles.nested}>
            {children.map((child) => renderNode(child, depth + 1, item.code))}
          </ul>
        )}
      </li>
    )
  }

  if (rootCategories.length === 0) {
    return <p className={styles.muted}>{t('adminPanel.noCategories')}</p>
  }

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>{t('adminPanel.categoryList')}</h3>
      <ul className={styles.list}>
        {rootCategories.map((root) => renderNode(root))}
      </ul>
    </div>
  )
}
