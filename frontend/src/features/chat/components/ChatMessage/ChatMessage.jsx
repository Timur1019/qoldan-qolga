import UserAvatar from '@/components/ui/UserAvatar'
import { formatTime } from '../../utils/chatFormat'
import styles from './ChatMessage.module.css'

export default function ChatMessage({
  message: m,
  isOwn,
  isSystemChat,
  displayName,
  avatar,
  userName,
  isEditing,
  menuOpen,
  editingText,
  onEditingTextChange,
  onToggleMenu,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  t,
}) {
  return (
    <div className={`${styles.msgRow} ${isOwn ? styles.msgRowOwn : ''}`}>
      {!isOwn && (
        isSystemChat ? (
          <span className={styles.msgSystemAvatar} aria-hidden>
            <i className="bi bi-bell" />
          </span>
        ) : (
          <UserAvatar avatar={avatar} name={m.senderName || ''} className={styles.msgAvatar} />
        )
      )}
      <div className={styles.msgCol}>
        {isEditing ? (
          <div className={`${styles.bubble} ${styles.bubbleOwn}`}>
            <input
              type="text"
              className="form-control form-control-sm mb-2"
              value={editingText}
              onChange={(e) => onEditingTextChange(e.target.value)}
              maxLength={2000}
              autoFocus
            />
            <div className="d-flex gap-1">
              <button type="button" className="btn btn-primary btn-sm" onClick={onSaveEdit}>
                {t('common.save')}
              </button>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={onCancelEdit}>
                {t('common.cancel')}
              </button>
            </div>
          </div>
        ) : (
          <div
            className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}
            onClick={() => isOwn && onToggleMenu(m.id)}
            role={isOwn ? 'button' : undefined}
            tabIndex={isOwn ? 0 : undefined}
            onKeyDown={(e) => isOwn && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onToggleMenu(m.id))}
          >
            <span className={styles.msgName}>{displayName}</span>
            {!isOwn && m.senderIsStore != null && (
              <span className={`badge me-1 ${m.senderIsStore ? 'bg-success' : 'bg-secondary'}`}>
                {m.senderIsStore ? 'Магазин' : 'Частный'}
              </span>
            )}
            <p className={styles.msgText}>{m.text}</p>
            <span className={styles.msgTime}>{formatTime(m.createdAt)}</span>
            {isOwn && menuOpen && (
              <div className={styles.msgMenu} onClick={(e) => e.stopPropagation()}>
                <button type="button" className="btn btn-light btn-sm p-1" onClick={() => onStartEdit(m)} title={t('chat.edit')} aria-label={t('chat.edit')}>
                  <i className="bi bi-pencil" aria-hidden />
                </button>
                <button type="button" className="btn btn-outline-danger btn-sm p-1" onClick={() => onDelete(m.id)} title={t('chat.delete')} aria-label={t('chat.delete')}>
                  <i className="bi bi-trash" aria-hidden />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {isOwn && !isEditing && (
        <UserAvatar
          avatar={avatar}
          name={userName || ''}
          own
          className={styles.msgAvatar}
        />
      )}
    </div>
  )
}
