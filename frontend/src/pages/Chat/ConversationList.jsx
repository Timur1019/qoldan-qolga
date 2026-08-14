import { useMemo } from 'react'
import { isSystemConversation } from '../../features/ad/utils/publicAds'
import UserAvatar from '../../components/ui/UserAvatar'
import styles from './ConversationList.module.css'

export default function ConversationList({ conversations, selectedId, onSelect, t }) {
  const ordered = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aSys = isSystemConversation(a) ? 0 : 1
      const bSys = isSystemConversation(b) ? 0 : 1
      if (aSys !== bSys) return aSys - bSys
      const aUnread = (a.unreadCount ?? 0) > 0 ? 0 : 1
      const bUnread = (b.unreadCount ?? 0) > 0 ? 0 : 1
      if (aUnread !== bUnread) return aUnread - bUnread
      return 0
    })
  }, [conversations])

  if (ordered.length === 0) {
    return (
      <div className={styles.empty}>
        <i className="bi bi-chat-left-dots" aria-hidden />
        <p>{t('chat.noConversations')}</p>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {ordered.map((c) => {
        const system = isSystemConversation(c)
        const unread = Number(c.unreadCount ?? c.unread_count ?? 0)
        const active = selectedId === c.id
        const title = system ? t('chat.notifications') : (c.otherPartyName || t('chat.conversation'))
        const subtitle = system ? t('chat.notificationsFrom') : (c.adTitle || '')
        return (
          <li key={c.id}>
            <button
              type="button"
              className={`${styles.row} ${active ? styles.rowActive : ''} ${unread > 0 && !active ? styles.rowUnread : ''} ${system ? styles.rowSystem : ''}`}
              onClick={() => onSelect(c.id)}
            >
              {system ? (
                <span className={styles.systemAvatar} aria-hidden>
                  <i className="bi bi-bell" />
                </span>
              ) : (
                <UserAvatar avatar={c.otherPartyAvatar} name={c.otherPartyName || ''} />
              )}
              <span className={styles.body}>
                <span className={styles.title}>{title}</span>
                {subtitle ? <span className={styles.subtitle}>{subtitle}</span> : null}
              </span>
              {unread > 0 && (
                <span className={styles.badge}>{unread > 99 ? '99+' : unread}</span>
              )}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
