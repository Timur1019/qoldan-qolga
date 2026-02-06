import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLang } from '../../context/LangContext'
import { chatApi } from '../../api/client'
import { useStompChat } from '../../hooks/useStompChat'
import { ROUTES, adsPath } from '../../constants/routes'
import styles from './Chat.module.css'

function formatTime(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
  const messagesEndRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId)

  const loadConversations = useCallback(() => {
    setLoading(true)
    setError('')
    chatApi
      .getConversations()
      .then(setConversations)
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
  }, [selectedId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleIncomingMessage = useCallback((msg) => {
    if (!msg || !msg.conversationId) return
    const fromOther = msg.senderId !== user?.id
    if (msg.conversationId === selectedId) {
      setMessages((prev) => {
        if (prev.some((m) => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    }
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== msg.conversationId) return c
        const next = { ...c, messageCount: (c.messageCount ?? 0) + 1 }
        if (fromOther) {
          next.incomingMessageCount = (c.incomingMessageCount ?? 0) + 1
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
              {conversations.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={selectedId === c.id ? styles.convBtnActive : styles.convBtn}
                    onClick={() => selectConversation(c.id)}
                  >
                    <span className={styles.convTitle}>{c.adTitle || t('chat.conversation')}</span>
                    <span className={styles.convParty}>{c.otherPartyName || '—'}</span>
                    {(c.incomingMessageCount ?? 0) > 0 && (
                      <span className={styles.convBadge}>{c.incomingMessageCount > 99 ? '99+' : c.incomingMessageCount}</span>
                    )}
                  </button>
                </li>
              ))}
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
                </div>
                <span className={styles.threadParty}>{selected?.otherPartyName || '—'}</span>
                {selected?.adId && (
                  <Link to={adsPath(selected.adId)} className={styles.threadAdLink} target="_blank" rel="noopener noreferrer">
                    {t('chat.viewAd')} →
                  </Link>
                )}
              </div>
              <div className={styles.messages}>
                {messagesLoading ? (
                  <p>{t('common.loading')}</p>
                ) : (
                  messages.map((m) => {
                    const isOwn = m.senderId === user?.id
                    const displayName = isOwn ? t('chat.you') : (m.senderName || '—')
                    const initials = getInitials(isOwn ? (user?.displayName || '') : m.senderName, isOwn)
                    return (
                      <div
                        key={m.id}
                        className={`${styles.msgRow} ${isOwn ? styles.msgRowOwn : ''}`}
                      >
                        {!isOwn && <span className={styles.msgAvatar} title={displayName}>{initials}</span>}
                        <div className={`${styles.msgBubble} ${isOwn ? styles.msgBubbleOwn : ''}`}>
                          <span className={styles.msgSender}>{displayName}</span>
                          <p className={styles.msgText}>{m.text}</p>
                          <span className={styles.msgTime}>{formatTime(m.createdAt)}</span>
                        </div>
                        {isOwn && <span className={styles.msgAvatarOwn} title={displayName}>{initials}</span>}
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
