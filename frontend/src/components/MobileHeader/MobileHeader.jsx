import styles from './MobileHeader.module.css'

export default function MobileHeader({
  mode,
  title,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onOpenCategories,
  onBack,
  placeholder,
  backLabel,
  lang,
  onLangChange,
}) {
  if (mode === 'search') {
    return (
      <div className={styles.header}>
        <form className={styles.search} onSubmit={onSearchSubmit} role="search">
          <i className={`bi bi-search ${styles.searchIcon}`} aria-hidden />
          <input
            type="search"
            className={styles.input}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            aria-label={placeholder}
          />
          <button
            type="button"
            className={styles.filterBtn}
            onClick={onOpenCategories}
            aria-label="Categories"
          >
            <i className="bi bi-sliders" aria-hidden />
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className={`${styles.header} ${styles.headerTitle}`}>
      {mode === 'back' && (
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label={backLabel}>
          <i className="bi bi-chevron-left" aria-hidden />
        </button>
      )}
      <h1 className={styles.title}>{title}</h1>
      {mode === 'title' && (
        <div className={styles.lang}>
          <button
            type="button"
            className={lang === 'uz' ? styles.langActive : styles.langBtn}
            onClick={() => onLangChange('uz')}
          >
            UZ
          </button>
          <button
            type="button"
            className={lang === 'ru' ? styles.langActive : styles.langBtn}
            onClick={() => onLangChange('ru')}
          >
            RU
          </button>
        </div>
      )}
    </div>
  )
}
