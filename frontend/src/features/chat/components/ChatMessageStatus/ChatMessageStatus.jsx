import styles from './ChatMessageStatus.module.css'

export default function ChatMessageStatus({ status }) {
  if (!status) return null
  const isRead = status === 'READ'
  const isDelivered = status === 'DELIVERED' || isRead
  const className = isRead ? styles.read : isDelivered ? styles.delivered : styles.sent

  return (
    <span className={`${styles.status} ${className}`} aria-label={status} title={status}>
      {isDelivered ? (
        <>
          <i className="bi bi-check2" aria-hidden />
          <i className="bi bi-check2" aria-hidden style={{ marginLeft: '-0.45em' }} />
        </>
      ) : (
        <i className="bi bi-check2" aria-hidden />
      )}
    </span>
  )
}
