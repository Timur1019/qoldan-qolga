import styles from './DesktopHeaderLang.module.css'

export default function DesktopHeaderLang({ lang, onChange }) {
  return (
    <div className={styles.switch} role="group" aria-label="Language">
      <button
        type="button"
        className={`${styles.btn} ${lang === 'uz' ? styles.active : ''}`}
        onClick={() => onChange('uz')}
      >
        OʻZB
      </button>
      <button
        type="button"
        className={`${styles.btn} ${lang === 'ru' ? styles.active : ''}`}
        onClick={() => onChange('ru')}
      >
        РУС
      </button>
    </div>
  )
}
