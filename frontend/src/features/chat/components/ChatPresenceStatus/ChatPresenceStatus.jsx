import { formatPresence, isUserOnline } from '../../utils/chatPresence'
import styles from './ChatPresenceStatus.module.css'

export default function ChatPresenceStatus({ lastSeenAt, isTyping, t }) {
  if (isTyping) {
    return <span className={`${styles.status} ${styles.typing}`}>{t('chat.typing')}</span>
  }
  if (!lastSeenAt) return null
  const online = isUserOnline(lastSeenAt)
  return (
    <span className={styles.status}>
      {online ? <span className={styles.onlineDot} aria-hidden /> : null}
      {formatPresence(lastSeenAt, t)}
    </span>
  )
}
