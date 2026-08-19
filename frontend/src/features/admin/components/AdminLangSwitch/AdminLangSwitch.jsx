import styles from './AdminLangSwitch.module.css'

export default function AdminLangSwitch({ lang, onChange }) {
  return (
    <div className={styles.switch} role="group" aria-label="Language">
      <button
        type="button"
        className={`${styles.btn} ${lang === 'ru' ? styles.active : ''}`}
        onClick={() => onChange('ru')}
      >
        RU
      </button>
      <button
        type="button"
        className={`${styles.btn} ${lang === 'uz' ? styles.active : ''}`}
        onClick={() => onChange('uz')}
      >
        UZ
      </button>
    </div>
  )
}
