import styles from './BusinessFormActions.module.css'

export default function BusinessFormActions({ submitting, onCancel }) {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.cancel} onClick={onCancel} disabled={submitting}>
        Отмена
      </button>
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Отправка…' : 'Отправить заявку'}
        {!submitting ? <i className={`bi bi-arrow-right ${styles.arrow}`} aria-hidden /> : null}
      </button>
    </div>
  )
}
