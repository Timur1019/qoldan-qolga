import styles from './Layout.module.css'

export default function DesktopRegionSelect({
  regionOpen,
  regionLabel,
  selectedRegionCode,
  regions,
  lang,
  onToggle,
  onClose,
  onSelect,
}) {
  return (
    <div className={styles.regionWrap}>
      <button
        type="button"
        className={`btn btn-sm btn-outline-light border ${styles.regionBtn}`}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={regionOpen}
        aria-label={lang === 'ru' ? 'Выбрать регион' : 'Hududni tanlash'}
      >
        <i className="bi bi-geo-alt me-1" aria-hidden />
        <span className={styles.regionLabel}>{regionLabel}</span>
        <i className={`bi ms-1 ${regionOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden />
      </button>
      {regionOpen && (
        <>
          <button
            type="button"
            className={styles.regionOverlay}
            onClick={onClose}
            aria-hidden
          />
          <div className={`dropdown-menu show ${styles.regionDropdown}`} role="listbox">
            <button
              type="button"
              className={`dropdown-item ${!selectedRegionCode ? 'active' : ''}`}
              onClick={() => onSelect('')}
              role="option"
              aria-selected={!selectedRegionCode}
            >
              {lang === 'ru' ? 'Все регионы' : 'Barcha hududlar'}
            </button>
            {regions.map((r) => (
              <button
                key={r.code}
                type="button"
                className={`dropdown-item ${selectedRegionCode === r.code ? 'active' : ''}`}
                onClick={() => onSelect(r.code)}
                role="option"
                aria-selected={selectedRegionCode === r.code}
              >
                {lang === 'ru' ? r.nameRu : r.nameUz}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
