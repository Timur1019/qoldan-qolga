import { useMemo, useState } from 'react'
import { isSystemConversation } from '@/features/ad'
import UserAvatar from '@/components/ui/UserAvatar'
import { formatTime } from '../../utils/chatFormat'
import ConversationListSearch from '../ConversationListSearch'
import styles from './ConversationList.module.css'

function previewText(c, t) {
  const raw = c.lastMessageText || c.last_message_text || ''
  if (raw) return raw
  if ((c.messageCount ?? 0) > 0) return t('chat.hasMessages')
  return ''
}

export default function ConversationList({ conversations, selectedId, onSelect, t }) {
  const [query, setQuery] = useState('')

  const ordered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...conversations]
      .filter((c) => {
        if (!q) return true
        const title = isSystemConversation(c)
          ? t('chat.notifications')
          : (c.otherPartyName || '')
        const ad = c.adTitle || ''
        const preview = previewText(c, t)
        return [title, ad, preview].some((s) => s.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        const aSys = isSystemConversation(a) ? 0 : 1
        const bSys = isSystemConversation(b) ? 0 : 1
        if (aSys !== bSys) return aSys - bSys
        const aUnread = (a.unreadCount ?? 0) > 0 ? 0 : 1
        const bUnread = (b.unreadCount ?? 0) > 0 ? 0 : 1
        if (aUnread !== bUnread) return aUnread - bUnread
        const aTime = new Date(a.lastMessageAt || a.createdAt || 0).getTime()
        const bTime = new Date(b.lastMessageAt || b.createdAt || 0).getTime()
        return bTime - aTime
      })
  }, [conversations, query, t])

  return (
    <>
      <ConversationListSearch value={query} onChange={setQuery} t={t} />
      {ordered.length === 0 ? (
        <div className={styles.empty}>
          <i className="bi bi-chat-left-dots" aria-hidden />
          <p>{query ? t('chat.noSearchResults') : t('chat.noConversations')}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {ordered.map((c) => {
            const system = isSystemConversation(c)
            const unread = Number(c.unreadCount ?? c.unread_count ?? 0)
            const active = selectedId === c.id
            const title = system ? t('chat.notifications') : (c.otherPartyName || t('chat.conversation'))
            const adTitle = system ? t('chat.notificationsFrom') : (c.adTitle || '')
            const preview = previewText(c, t)
            const time = formatTime(c.lastMessageAt || c.createdAt)
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
                    <span className={styles.topLine}>
                      <span className={styles.title}>{title}</span>
                      {time ? <span className={styles.time}>{time}</span> : null}
                    </span>
                    {adTitle ? <span className={styles.adTitle}>{adTitle}</span> : null}
                    {preview ? <span className={styles.preview}>{preview}</span> : null}
                  </span>
                  {unread > 0 && (
                    <span className={styles.badge}>{unread > 99 ? '99+' : unread}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
