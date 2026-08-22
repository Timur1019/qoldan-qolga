import styles from './ConversationListSearch.module.css'

export default function ConversationListSearch({ value, onChange, t }) {
  return (
    <div className={styles.searchWrap}>
      <label className={styles.search}>
        <i className="bi bi-search" aria-hidden />
        <input
          type="search"
          className={styles.input}
          placeholder={t('chat.searchMessages')}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>
    </div>
  )
}
