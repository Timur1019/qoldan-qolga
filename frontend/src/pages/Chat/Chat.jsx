import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { chatApi } from '../../api/client'
import { useStompChat } from '../../hooks/useStompChat'
import { ROUTES, adsPath } from '../../constants/routes'
import { imageUrl } from '../../api/client'
import styles from './Chat.module.css'

const AVATAR_EMOJI = { star: '⭐', cactus: '🌵', donut: '🍩', duck: '🦆', cat: '🐱', alien: '👽' }

function isAvatarPhoto(avatar) {
  return avatar && typeof avatar === 'string' && (avatar.startsWith('/') || avatar.startsWith('http'))
}

function renderAvatar(avatar, initials) {
  if (isAvatarPhoto(avatar)) {
    return <img src={imageUrl(avatar)} alt="" className={styles.avatarImg} />
  }
  const emoji = avatar && AVATAR_EMOJI[avatar]
  return emoji ?? initials
}

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
  const selectedIdRef = useRef(selectedId)
  selectedIdRef.current = selectedId

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

  // Синхронизация выбора диалога с URL и списком. Без selectedId в deps — иначе при обновлении conversations (markAsRead) эффект перезапускается и даёт дрожание.
  useEffect(() => {
    const current = selectedIdRef.current
    if (openId && conversations.some((c) => c.id === openId)) {
      if (current !== openId) setSelectedId(openId)
    } else if (conversations.length > 0 && !current) {
      setSelectedId(openId || conversations[0].id)
    }
  }, [openId, conversations])

  useEffect(() => {
    if (!selectedId) return
    setMessages([])
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
      <div className="page-container app-page">
        <p>{t('common.loading')}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle me-2" aria-hidden /> {error}
        </div>
      </div>
    )
  }

  return (
    <div className="page-container app-page">
      <h1 className="h2 mb-3">{t('profile.chat')}</h1>
      <div className={`${styles.layout} app-card border-0 shadow-sm overflow-hidden`}>
        <aside className={styles.sidebar}>
          {conversations.length === 0 ? (
            <div className="p-4 text-center text-muted small">
              <i className="bi bi-chat-left-dots d-block fs-2 mb-2 opacity-50" aria-hidden />
              <p className="mb-0">{t('chat.noConversations')}</p>
            </div>
          ) : (
            <ul className="list-group list-group-flush rounded-0">
              {conversations.map((c) => {
                const unread = c.unreadCount ?? c.unread_count ?? 0
                const name = c.otherPartyName || '—'
                const initials = getInitials(name, false)
                const isActive = selectedId === c.id
                return (
                  <li key={c.id} className="list-group-item list-group-item-action border-0 border-bottom p-0">
                    <button
                      type="button"
                      className={`d-flex align-items-center gap-2 w-100 text-start p-3 border-0 ${isActive ? styles.convBtnActive : styles.convBtn}`}
                      onClick={() => selectConversation(c.id)}
                    >
                      <span className={`${styles.convAvatar} flex-shrink-0`} title={name}>{renderAvatar(c.otherPartyAvatar, initials)}</span>
                      <span className="flex-grow-1 min-w-0">
                        <span className="d-block fw-semibold text-truncate small">{c.adTitle || t('chat.conversation')}</span>
                        <span className="d-block text-muted text-truncate" style={{ fontSize: '0.8rem' }}>{name}</span>
                      </span>
                      {unread > 0 && (
                        <span className="badge rounded-pill bg-primary flex-shrink-0">{unread > 99 ? '99+' : unread}</span>
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
            <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-muted py-5">
              <i className="bi bi-chat-square-text display-4 mb-3 opacity-25" aria-hidden />
              <p className="mb-0 small">{t('chat.selectConversation')}</p>
            </div>
          ) : (
            <div key={selectedId} className={`d-flex flex-column flex-grow-1 min-h-0 ${styles.threadContent}`}>
              <div className="border-bottom bg-light bg-opacity-50 px-3 py-2">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <span className={styles.threadAvatar} title={selected?.otherPartyName || ''}>
                    {renderAvatar(selected?.otherPartyAvatar, getInitials(selected?.otherPartyName || '—', false))}
                  </span>
                  <div className="flex-grow-1 min-w-0">
                    <span className="fw-semibold d-block text-truncate">{selected?.otherPartyName || '—'}</span>
                    {selected?.adTitle && (
                      <span className="small text-muted d-block text-truncate">{selected.adTitle}</span>
                    )}
                  </div>
                  <span className="badge bg-secondary text-white rounded-pill">
                    <i className="bi bi-chat-dots me-1" aria-hidden /> {messages.length}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={handleDeleteChat}
                    title={t('chat.deleteChat')}
                    aria-label={t('chat.deleteChat')}
                  >
                    <i className="bi bi-trash" aria-hidden />
                  </button>
                </div>
                {selected?.adId && (
                  <Link to={adsPath(selected.adId)} className="small text-primary text-decoration-none mt-1 d-inline-block" target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-box-arrow-up-right me-1" aria-hidden /> {t('chat.viewAd')}
                  </Link>
                )}
              </div>
              <div className={`flex-grow-1 overflow-auto p-3 ${styles.messages}`} ref={messagesContainerRef}>
                {messagesLoading ? (
                  <div className="text-center text-muted py-4">
                    <div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden />
                    {t('common.loading')}
                  </div>
                ) : (
                  groupMessagesByDate(messages).map((item, idx) => {
                    if (item.type === 'date') {
                      return (
                        <div key={`date-${idx}`} className="text-center my-2">
                          <span className="badge bg-light text-muted rounded-pill px-3 py-2 fw-normal">
                            {formatDateHeader(item.createdAt || '', t)}
                          </span>
                        </div>
                      )
                    }
                    const m = item.msg
                    const isOwn = m.senderId === user?.id
                    const displayName = isOwn ? t('chat.you') : (m.senderName || '—')
                    const avatar = isOwn ? user?.avatar : m.senderAvatar
                    const initials = getInitials(isOwn ? (user?.displayName || '') : m.senderName, isOwn)
                    const isEditing = editingMessageId === m.id
                    const menuOpen = messageMenuId === m.id
                    return (
                      <div
                        key={m.id}
                        className={`d-flex align-items-end gap-2 mb-2 ${isOwn ? 'flex-row-reverse' : ''}`}
                      >
                        {!isOwn && <span className={styles.msgAvatar} title={displayName}>{renderAvatar(avatar, initials)}</span>}
                        <div className={isOwn ? 'd-flex flex-row-reverse' : ''} style={{ maxWidth: '75%' }}>
                          {isEditing ? (
                            <div className={`rounded-3 p-2 ${styles.bubbleOwn}`}>
                              <input
                                type="text"
                                className="form-control form-control-sm mb-2"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                maxLength={2000}
                                autoFocus
                              />
                              <div className="d-flex gap-1">
                                <button type="button" className="btn btn-primary btn-sm" onClick={handleSaveEdit}>
                                  {t('common.save')}
                                </button>
                                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleCancelEdit}>
                                  {t('common.cancel')}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`rounded-3 px-3 py-2 position-relative ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}
                              onClick={() => isOwn && setMessageMenuId((prev) => (prev === m.id ? null : m.id))}
                              role={isOwn ? 'button' : undefined}
                              tabIndex={isOwn ? 0 : undefined}
                              onKeyDown={(e) => isOwn && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setMessageMenuId((prev) => (prev === m.id ? null : m.id)))}
                            >
                              <span className="d-block small fw-semibold text-body-secondary mb-1">{displayName}</span>
                              {!isOwn && m.senderIsStore != null && (
                                <span className={`badge me-1 ${m.senderIsStore ? 'bg-success' : 'bg-secondary'}`} style={{ fontSize: '0.65rem' }}>
                                  {m.senderIsStore ? 'Магазин' : 'Частный'}
                                </span>
                              )}
                              <p className="mb-1 small text-break" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</p>
                              <span className="small text-muted opacity-75">{formatTime(m.createdAt)}</span>
                              {isOwn && menuOpen && (
                                <div className="position-absolute top-0 end-0 d-flex gap-1 m-1" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    type="button"
                                    className="btn btn-light btn-sm p-1"
                                    onClick={() => handleStartEdit(m)}
                                    title={t('chat.edit')}
                                    aria-label={t('chat.edit')}
                                  >
                                    <i className="bi bi-pencil" aria-hidden />
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm p-1"
                                    onClick={() => handleDeleteMessage(m.id)}
                                    title={t('chat.delete')}
                                    aria-label={t('chat.delete')}
                                  >
                                    <i className="bi bi-trash" aria-hidden />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {isOwn && !isEditing && <span className={styles.msgAvatarOwn} title={displayName}>{renderAvatar(avatar, initials)}</span>}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              <form className="d-flex gap-2 p-3 border-top bg-light bg-opacity-50" onSubmit={handleSend}>
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('chat.placeholder')}
                  value={sendText}
                  onChange={(e) => setSendText(e.target.value)}
                  maxLength={2000}
                  disabled={sending}
                />
                <button type="submit" className="btn btn-primary flex-shrink-0" disabled={sending || !sendText.trim()}>
                  <i className="bi bi-send-fill" aria-hidden /> <span className="d-none d-sm-inline">{t('chat.send')}</span>
                </button>
              </form>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
