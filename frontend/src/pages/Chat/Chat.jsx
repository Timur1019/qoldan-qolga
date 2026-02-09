import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { chatApi } from '../../api/client'
import { useStompChat } from '../../hooks/useStompChat'
import { ROUTES, adsPath } from '../../constants/routes'
import styles from './Chat.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateHeader(dateStr, t) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const today = now.toDateString()
  const yesterday = new Date(now.getTime() - 86400000).toDateString()
  if (d.toDateString() === today) return t('chat.today')
  if (d.toDateString() === yesterday) return t('chat.yesterday')
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function groupMessagesByDate(messages) {
  const groups = []
  let currentDate = null
  for (const m of messages) {
    const dateKey = m.createdAt ? new Date(m.createdAt).toDateString() : ''
    if (dateKey !== currentDate) {
      currentDate = dateKey
      groups.push({ type: 'date', createdAt: m.createdAt })
    }
    groups.push({ type: 'msg', msg: m })
  }
  return groups
}

function getInitials(name, isYou) {
  if (isYou) return (name && name.slice(0, 1).toUpperCase()) || '?'
  if (!name || !name.trim()) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export default function Chat() {
  const { user } = useAuth()
  const { t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const openId = searchParams.get('conversation') || null

  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [error, setError] = useState('')
  const [sendText, setSendText] = useState('')
  const [sending, setSending] = useState(false)
  const [messageMenuId, setMessageMenuId] = useState(null)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId)

  useEffect(() => {
    const closeMenu = (e) => {
      if (messageMenuId != null && messagesContainerRef.current && !messagesContainerRef.current.contains(e.target)) {
        setMessageMenuId(null)
      }
    }
    document.addEventListener('click', closeMenu)
    return () => document.removeEventListener('click', closeMenu)
  }, [messageMenuId])

  const loadConversations = useCallback(() => {
    setLoading(true)
    setError('')
    chatApi
      .getConversations()
      .then((list) => {
        setConversations(list || [])
        // Синхронизировать бейдж в шапке и в левом меню профиля
        window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (openId && conversations.some((c) => c.id === openId)) {
      setSelectedId(openId)
    } else if (conversations.length > 0 && !selectedId) {
      setSelectedId(openId || conversations[0].id)
    }
  }, [openId, conversations, selectedId])

  useEffect(() => {
    if (!selectedId) {
      setMessages([])
      return
    }
    setMessagesLoading(true)
    chatApi
      .getMessages(selectedId)
      .then(setMessages)
      .catch(() => setMessages([]))
      .finally(() => setMessagesLoading(false))
    chatApi.markAsRead(selectedId).then(() => {
      window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
      )
    }).catch(() => {})
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleIncomingMessage = useCallback((msg) => {
    if (!msg || !msg.conversationId) return
    const fromOther = msg.senderId !== user?.id
    const isViewingThis = msg.conversationId === selectedId
    if (isViewingThis) {
      setMessages((prev) => {
        const existing = prev.findIndex((m) => m.id === msg.id)
        if (existing >= 0) return prev.map((m, i) => (i === existing ? msg : m))
        return [...prev, msg]
      })
      if (fromOther) {
        chatApi.markAsRead(msg.conversationId).then(() => {
          window.dispatchEvent(new CustomEvent('chat-count-refresh'))
        }).catch(() => {})
      }
    }
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== msg.conversationId) return c
        const next = { ...c, messageCount: (c.messageCount ?? 0) + 1 }
        if (fromOther && !isViewingThis) {
          next.unreadCount = (c.unreadCount ?? 0) + 1
          window.dispatchEvent(new CustomEvent('chat-count-refresh'))
        }
        return next
      })
    )
  }, [selectedId, user?.id])

  useStompChat(selectedId, handleIncomingMessage)

  const handleSend = (e) => {
    e.preventDefault()
    const text = sendText.trim()
    if (!text || !selectedId || sending) return
    setSending(true)
    chatApi
      .sendMessage(selectedId, text)
      .then(() => {
        setSendText('')
        // Сообщение придёт по WebSocket (сервер шлёт в топик), не добавляем здесь — иначе дубль
      })
      .catch(() => {})
      .finally(() => setSending(false))
  }

  const selectConversation = (id) => {
    setSelectedId(id)
    setSearchParams({ conversation: id }, { replace: true })
  }

  const handleDeleteMessage = (messageId) => {
    if (!selectedId || !window.confirm(t('chat.confirmDeleteMessage'))) return
    chatApi
      .deleteMessage(selectedId, messageId)
      .then(() => setMessages((prev) => prev.filter((m) => m.id !== messageId)))
      .catch(() => {})
    setMessageMenuId(null)
  }

  const handleStartEdit = (m) => {
    setEditingMessageId(m.id)
    setEditingText(m.text)
    setMessageMenuId(null)
  }

  const handleSaveEdit = () => {
    if (!selectedId || !editingMessageId || editingText.trim() === '') return
    chatApi
      .updateMessage(selectedId, editingMessageId, editingText.trim())
      .then((updated) => {
        setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))
        setEditingMessageId(null)
        setEditingText('')
      })
      .catch(() => {})
  }

  const handleCancelEdit = () => {
    setEditingMessageId(null)
    setEditingText('')
  }

  const handleDeleteChat = () => {
    if (!selectedId || !window.confirm(t('chat.confirmDeleteChat'))) return
    chatApi
      .deleteConversation(selectedId)
      .then(() => {
        const next = conversations.filter((c) => c.id !== selectedId)
        setConversations(next)
        setSelectedId(next[0]?.id ?? null)
        setMessages([])
        setSearchParams(next[0] ? { conversation: next[0].id } : {}, { replace: true })
        window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      })
      .catch(() => {})
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{t('profile.chat')}</h1>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          {conversations.length === 0 ? (
            <p className={styles.noChats}>{t('chat.noConversations')}</p>
          ) : (
            <ul className={styles.convList}>
              {conversations.map((c) => {
                const unread = c.unreadCount ?? c.unread_count ?? 0
                const name = c.otherPartyName || '—'
                const otherAvatar = c.otherPartyAvatar && AVATAR_EMOJI[c.otherPartyAvatar] ? AVATAR_EMOJI[c.otherPartyAvatar] : null
                const initials = getInitials(name, false)
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={selectedId === c.id ? styles.convBtnActive : styles.convBtn}
                      onClick={() => selectConversation(c.id)}
                    >
                      <span className={styles.convAvatar} title={name}>{otherAvatar ?? initials}</span>
                      <span className={styles.convInfo}>
                        <span className={styles.convTitle}>{c.adTitle || t('chat.conversation')}</span>
                        <span className={styles.convParty}>{name}</span>
                      </span>
                      {unread > 0 && (
                        <span className={styles.convBadge}>{unread > 99 ? '99+' : unread}</span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </aside>
        <section className={styles.thread}>
          {!selectedId ? (
            <p className={styles.hint}>{t('chat.selectConversation')}</p>
          ) : (
            <>
              <div className={styles.threadHead}>
                <div className={styles.threadHeadTop}>
                  <span className={styles.threadTitle}>{selected?.adTitle || ''}</span>
                  <span className={styles.threadCount}>
                    {messages.length} {t('chat.messagesCount')}
                  </span>
                  <button
                    type="button"
                    className={styles.threadDeleteBtn}
                    onClick={handleDeleteChat}
                    title={t('chat.deleteChat')}
                    aria-label={t('chat.deleteChat')}
                  >
                    <span className={styles.threadDeleteIcon} aria-hidden>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={18} height={18}>
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </span>
                  </button>
                </div>
                <span className={styles.threadParty}>{selected?.otherPartyName || '—'}</span>
                {selected?.adId && (
                  <Link to={adsPath(selected.adId)} className={styles.threadAdLink} target="_blank" rel="noopener noreferrer">
                    {t('chat.viewAd')} →
                  </Link>
                )}
              </div>
              <div className={styles.messages} ref={messagesContainerRef}>
                {messagesLoading ? (
                  <p>{t('common.loading')}</p>
                ) : (
                  groupMessagesByDate(messages).map((item, idx) => {
                    if (item.type === 'date') {
                      return (
                        <div key={`date-${idx}`} className={styles.dateHeader}>
                          {formatDateHeader(item.createdAt || '', t)}
                        </div>
                      )
                    }
                    const m = item.msg
                    const isOwn = m.senderId === user?.id
                    const displayName = isOwn ? t('chat.you') : (m.senderName || '—')
                    const ownAvatar = isOwn && user?.avatar && AVATAR_EMOJI[user.avatar] ? AVATAR_EMOJI[user.avatar] : null
                    const otherAvatar = !isOwn && m.senderAvatar && AVATAR_EMOJI[m.senderAvatar] ? AVATAR_EMOJI[m.senderAvatar] : null
                    const initials = getInitials(isOwn ? (user?.displayName || '') : m.senderName, isOwn)
                    const isEditing = editingMessageId === m.id
                    const menuOpen = messageMenuId === m.id
                    return (
                      <div
                        key={m.id}
                        className={`${styles.msgRow} ${isOwn ? styles.msgRowOwn : ''}`}
                      >
                        {!isOwn && <span className={styles.msgAvatar} title={displayName}>{otherAvatar ?? initials}</span>}
                        <div className={styles.msgBubbleWrap}>
                          {isEditing ? (
                            <div className={`${styles.msgBubble} ${styles.msgBubbleOwn}`}>
                              <input
                                type="text"
                                className={styles.msgEditInput}
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                maxLength={2000}
                                autoFocus
                              />
                              <div className={styles.msgActions}>
                                <button type="button" className={styles.msgActionBtn} onClick={handleSaveEdit}>
                                  {t('common.save')}
                                </button>
                                <button type="button" className={styles.msgActionBtn} onClick={handleCancelEdit}>
                                  {t('common.cancel')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`${styles.msgBubble} ${isOwn ? styles.msgBubbleOwn : ''} ${isOwn ? styles.msgBubbleClickable : ''}`}
                              onClick={() => isOwn && setMessageMenuId((prev) => (prev === m.id ? null : m.id))}
                              role={isOwn ? 'button' : undefined}
                              tabIndex={isOwn ? 0 : undefined}
                              onKeyDown={(e) => isOwn && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setMessageMenuId((prev) => (prev === m.id ? null : m.id)))}
                            >
                              <span className={styles.msgSender}>{displayName}</span>
                              <p className={styles.msgText}>{m.text}</p>
                              <span className={styles.msgTime}>{formatTime(m.createdAt)}</span>
                              {isOwn && menuOpen && (
                                <div className={styles.msgMenu} onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className={styles.msgMenuBtn}
                                    onClick={() => handleStartEdit(m)}
                                    title={t('chat.edit')}
                                    aria-label={t('chat.edit')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}>
                                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                      <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    className={styles.msgMenuBtn}
                                    onClick={() => handleDeleteMessage(m.id)}
                                    title={t('chat.delete')}
                                    aria-label={t('chat.delete')}
                                  >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={14} height={14}>
                                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                                      <line x1="10" y1="11" x2="10" y2="17" />
                                      <line x1="14" y1="11" x2="14" y2="17" />
                                    </svg>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {isOwn && !isEditing && <span className={styles.msgAvatarOwn} title={displayName}>{ownAvatar ?? initials}</span>}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className={styles.sendForm} onSubmit={handleSend}>
                <input
                  type="text"
                  className={styles.sendInput}
                  placeholder={t('chat.placeholder')}
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  maxLength={2000}
                  disabled={sending}
                />
                <button type="submit" className={styles.sendBtn} disabled={sending || !sendText.trim()}>
                  {t('chat.send')}
                </button>
              </form>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
