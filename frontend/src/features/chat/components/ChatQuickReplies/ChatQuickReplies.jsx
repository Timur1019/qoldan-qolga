import { CHAT_QUICK_REPLY_KEYS } from '../../utils/chatQuickReplies'
import styles from './ChatQuickReplies.module.css'

export default function ChatQuickReplies({ onSelect, t }) {
  return (
    <div className={styles.wrap}>
      {CHAT_QUICK_REPLY_KEYS.map((key) => (
        <button key={key} type="button" className={styles.chip} onClick={() => onSelect(t(key))}>
          {t(key)}
        </button>
      ))}
    </div>
  )
}
