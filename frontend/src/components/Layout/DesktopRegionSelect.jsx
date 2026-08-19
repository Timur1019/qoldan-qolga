import styles from './DesktopRegionSelect.module.css'

export default function DesktopRegionSelect({
  regionOpen,
  regionLabel,
  selectedRegionCode,
  regions,
  lang,
  allRegionsLabel,
  onToggle,
  onClose,
  onSelect,
}) {
  return (
    <div className={styles.wrap}>
      <button
        type="button"
        className={styles.btn}
        onClick={onToggle}
        aria-haspopup="listbox"
        aria-expanded={regionOpen}
        aria-label={lang === 'ru' ? 'Выбрать регион' : 'Hududni tanlash'}
      >
        <i className={`bi bi-send-fill ${styles.icon}`} aria-hidden />
        <span className={styles.label}>{regionLabel}</span>
      </button>
      {regionOpen && (
        <>
          <button
            type="button"
            className={styles.overlay}
            onClick={onClose}
            aria-hidden
          />
          <div className={`dropdown-menu show ${styles.dropdown}`} role="listbox">
            <button
              type="button"
              className={`dropdown-item ${!selectedRegionCode ? 'active' : ''}`}
              onClick={() => onSelect('')}
              role="option"
              aria-selected={!selectedRegionCode}
            >
              {allRegionsLabel}
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
