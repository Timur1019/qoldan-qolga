import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { chatApi } from '@/api/chat'
import { useIsMobile, useStompChat } from '@/hooks'
import { isSystemConversation, takePendingChat } from '@/features/ad'
import { asMessageList, upsertMessage } from '../utils/chatListUtils'

export default function useChatPage() {
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

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

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
      return
    }
    if (isMobile) {
      if (!openId && current) setSelectedId(null)
      return
    }
    if (conversations.length > 0 && !current) {
      setSelectedId(conversations[0].id)
    }
  }, [openId, conversations, isMobile])

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

  const threadTitle = isSystemChat
    ? t('chat.notifications')
    : (selected?.otherPartyName || '—')
  const threadSubtitle = isSystemChat
    ? t('chat.notificationsFrom')
    : selected?.adTitle

  return {
    t,
    user,
    isMobile,
    conversations,
    selected,
    selectedId,
    messages,
    loading,
    messagesLoading,
    error,
    sendText,
    setSendText,
    sending,
    messageMenuId,
    setMessageMenuId,
    editingMessageId,
    editingText,
    setEditingText,
    messagesEndRef,
    messagesContainerRef,
    isSystemChat,
    threadTitle,
    threadSubtitle,
    handleSend,
    selectConversation,
    handleDeleteMessage,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteChat,
  }
}
