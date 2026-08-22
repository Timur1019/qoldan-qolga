import UserAvatar from '@/components/ui/UserAvatar'
import ChatPresenceStatus from '../ChatPresenceStatus'
import ChatThreadMenu from '../ChatThreadMenu'
import styles from './ChatThreadHeader.module.css'

export default function ChatThreadHeader({
  isSystemChat,
  isMobile,
  isTopBar,
  title,
  subtitle,
  avatar,
  lastSeenAt,
  isTyping,
  menuOpen,
  muted,
  onBack,
  onToggleMenu,
  onCloseMenu,
  onMute,
  onBlock,
  onReport,
  onDelete,
  t,
}) {
  return (
    <div className={`${styles.head} ${isTopBar ? styles.headTopBar : ''}`}>
      <div className={styles.main}>
        {isMobile && (
          <button type="button" className={styles.backBtn} onClick={onBack} aria-label={t('common.back')}>
            <i className="bi bi-arrow-left" aria-hidden />
          </button>
        )}
        {isSystemChat ? (
          <span className={styles.systemAvatar} aria-hidden>
            <i className="bi bi-bell" />
          </span>
        ) : (
          <UserAvatar avatar={avatar} name={title || ''} className={styles.avatar} />
        )}
        <div className={styles.text}>
          <span className={styles.name}>{title}</span>
          {isSystemChat ? (
            subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null
          ) : (
            <ChatPresenceStatus lastSeenAt={lastSeenAt} isTyping={isTyping} t={t} />
          )}
        </div>
        {!isSystemChat && (
          <ChatThreadMenu
            open={menuOpen}
            muted={muted}
            onToggle={onToggleMenu}
            onClose={onCloseMenu}
            onMute={onMute}
            onBlock={onBlock}
            onReport={onReport}
            onDelete={onDelete}
            t={t}
          />
        )}
      </div>
    </div>
  )
}
