import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { chatApi } from '../../api/client'
import { useIsMobile, useStompChat } from '../../hooks'
import { adsPath } from '../../constants/routes'
import { isSystemConversation } from '../../features/ad/utils/publicAds'
import UserAvatar, { getInitials } from '../../components/ui/UserAvatar'
import ConversationList from './ConversationList'
import { formatTime, formatDateHeader, groupMessagesByDate } from './chatFormat'
import { asMessageList, upsertMessage } from './chatListUtils'
import { takePendingChat } from '../../features/ad/utils/pendingChat'
import styles from './Chat.module.css'

export default function Chat() {
  const { user, isAuthenticated } = useAuth()
  const { t } = useLang()
  const isMobile = useIsMobile()
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
  const isSystemChat = isSystemConversation(selected)
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
    if (!isAuthenticated) {
      setConversations([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError('')
    chatApi
      .getConversations()
      .then((list) => {
        setConversations(asMessageList(list))
        window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [isAuthenticated])

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    if (!isAuthenticated) return
    const pending = takePendingChat()
    if (!pending?.adId) return
    chatApi
      .getOrCreateConversation(pending.adId)
      .then(async (conv) => {
        if (pending.text) {
          await chatApi.sendMessage(conv.id, pending.text)
        }
        setSearchParams({ conversation: conv.id }, { replace: true })
        loadConversations()
      })
      .catch(() => {})
  }, [isAuthenticated, loadConversations, setSearchParams])

  useEffect(() => {
    const current = selectedIdRef.current
    if (openId && conversations.some((c) => c.id === openId)) {
      if (current !== openId) setSelectedId(openId)
    } else if (conversations.length > 0 && !current) {
      setSelectedId(openId || conversations[0].id)
    }
  }, [openId, conversations])

  useEffect(() => {
    if (!selectedId || !isAuthenticated) return undefined
    let cancelled = false
    setMessagesLoading(true)
    chatApi
      .getMessages(selectedId)
      .then((list) => {
        if (!cancelled) setMessages(asMessageList(list))
      })
      .catch(() => {
        if (!cancelled) setMessages([])
      })
      .finally(() => {
        if (!cancelled) setMessagesLoading(false)
      })
    chatApi.markAsRead(selectedId).then(() => {
      window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
      )
    }).catch(() => {})
    return () => {
      cancelled = true
    }
  }, [selectedId, isAuthenticated, user?.id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleIncomingMessage = useCallback((msg) => {
    if (!msg || !msg.conversationId) return
    const fromOther = msg.senderId !== user?.id
    const isViewingThis = msg.conversationId === selectedId
    if (isViewingThis) {
      setMessages((prev) => upsertMessage(prev, msg))
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
    if (!text || !selectedId || sending || isSystemChat) return
    setSending(true)
    chatApi
      .sendMessage(selectedId, text)
      .then((created) => {
        setSendText('')
        if (created) setMessages((prev) => upsertMessage(prev, created))
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

  const threadTitle = isSystemChat
    ? t('chat.notifications')
    : (selected?.otherPartyName || '—')
  const threadSubtitle = isSystemChat
    ? t('chat.notificationsFrom')
    : selected?.adTitle

  return (
    <div className="page-container app-page">
      {!isMobile && <h1 className="h2 mb-3">{t('profile.chat')}</h1>}
      <div className={`${styles.layout} ${isMobile && selectedId ? styles.threadOpen : ''} app-card border-0 shadow-sm overflow-hidden`}>
        <aside className={styles.sidebar}>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId}
            onSelect={selectConversation}
            t={t}
          />
        </aside>
        <section className={styles.thread}>
          {!selectedId ? (
            <div className={styles.threadEmpty}>
              <i className="bi bi-chat-square-text" aria-hidden />
              <p>{t('chat.selectConversation')}</p>
            </div>
          ) : (
            <div key={selectedId} className={styles.threadContent}>
              <div className={styles.threadHead}>
                <div className={styles.threadHeadMain}>
                  {isSystemChat ? (
                    <span className={styles.systemAvatar} aria-hidden>
                      <i className="bi bi-bell" />
                    </span>
                  ) : (
                    <UserAvatar
                      avatar={selected?.otherPartyAvatar}
                      name={selected?.otherPartyName || ''}
                      className={styles.threadAvatar}
                    />
                  )}
                  <div className={styles.threadHeadText}>
                    <span className={styles.threadName}>{threadTitle}</span>
                    {threadSubtitle ? <span className={styles.threadAd}>{threadSubtitle}</span> : null}
                  </div>
                  <span className={styles.countBadge}>
                    <i className="bi bi-chat-dots" aria-hidden /> {messages.length}
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
                {selected?.adId && !isSystemChat && (
                  <Link to={adsPath(selected.adId)} className={styles.viewAd} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-box-arrow-up-right" aria-hidden /> {t('chat.viewAd')}
                  </Link>
                )}
              </div>
              <div className={styles.messages} ref={messagesContainerRef}>
                {messagesLoading ? (
                  <div className={styles.messagesLoading}>
                    <div className="spinner-border spinner-border-sm" role="status" aria-hidden />
                    {t('common.loading')}
                  </div>
                ) : (
                  groupMessagesByDate(asMessageList(messages)).map((item, idx) => {
                    if (item.type === 'date') {
                      return (
                        <div key={`date-${idx}`} className={styles.dateWrap}>
                          <span>{formatDateHeader(item.createdAt || '', t)}</span>
                        </div>
                      )
                    }
                    const m = item.msg
                    const isOwn = m.senderId === user?.id
                    const displayName = isOwn ? t('chat.you') : (m.senderName || '—')
                    const avatar = isOwn ? user?.avatar : m.senderAvatar
                    const isEditing = editingMessageId === m.id
                    const menuOpen = messageMenuId === m.id
                    return (
                      <div
                        key={m.id}
                        className={`${styles.msgRow} ${isOwn ? styles.msgRowOwn : ''}`}
                      >
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
                              className={`${styles.bubble} ${isOwn ? styles.bubbleOwn : styles.bubbleOther}`}
                              onClick={() => isOwn && setMessageMenuId((prev) => (prev === m.id ? null : m.id))}
                              role={isOwn ? 'button' : undefined}
                              tabIndex={isOwn ? 0 : undefined}
                              onKeyDown={(e) => isOwn && (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setMessageMenuId((prev) => (prev === m.id ? null : m.id)))}
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
                                  <button type="button" className="btn btn-light btn-sm p-1" onClick={() => handleStartEdit(m)} title={t('chat.edit')} aria-label={t('chat.edit')}>
                                    <i className="bi bi-pencil" aria-hidden />
                                  </button>
                                  <button type="button" className="btn btn-outline-danger btn-sm p-1" onClick={() => handleDeleteMessage(m.id)} title={t('chat.delete')} aria-label={t('chat.delete')}>
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
                            name={user?.displayName || ''}
                            initials={getInitials(user?.displayName || '')}
                            own
                            className={styles.msgAvatar}
                          />
                        )}
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              {isSystemChat ? (
                <div className={styles.readonlyBar}>{t('chat.systemReadonly')}</div>
              ) : (
                <form className={styles.composer} onSubmit={handleSend}>
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
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
