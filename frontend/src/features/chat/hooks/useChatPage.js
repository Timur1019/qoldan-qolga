import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLang } from '@/context/LangContext'
import { chatApi } from '@/api/chat'
import { adsApi } from '@/api/ads'
import { useIsMobile, useStompChat } from '@/hooks'
import { notifyToast } from '@/utils/toastBus'
import { isSystemConversation, takePendingChat } from '@/features/ad'
import { asMessageList, upsertMessage } from '../utils/chatListUtils'
import { applyReadStatus, parseChatWsEvent } from '../utils/chatWsEvent'
import {
  blockUser,
  isConversationMuted,
  isUserBlocked,
  toggleMuteConversation,
} from '../utils/chatPreferences'

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
  const [uploading, setUploading] = useState(false)
  const [messageMenuId, setMessageMenuId] = useState(null)
  const [editingMessageId, setEditingMessageId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [threadMenuOpen, setThreadMenuOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [reportSubmitting, setReportSubmitting] = useState(false)
  const [muted, setMuted] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId)
  const isSystemChat = isSystemConversation(selected)
  const selectedIdRef = useRef(selectedId)

  useEffect(() => {
    selectedIdRef.current = selectedId
  }, [selectedId])

  useEffect(() => {
    setMuted(selectedId ? isConversationMuted(selectedId) : false)
    setThreadMenuOpen(false)
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
        const filtered = asMessageList(list).filter((c) => !isUserBlocked(c.otherPartyId))
        setConversations(filtered)
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
          await chatApi.sendMessage(conv.id, { text: pending.text })
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

  const updateConversationPreview = useCallback((conversationId, msg) => {
    const preview = msg.text || (msg.messageType === 'IMAGE' ? '📷' : msg.attachmentUrl ? '📎' : '')
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c
        return {
          ...c,
          lastMessageText: preview,
          lastMessageAt: msg.createdAt || c.lastMessageAt,
          messageCount: (c.messageCount ?? 0) + 1,
        }
      })
    )
  }, [])

  const handleWsEvent = useCallback((body) => {
    const event = parseChatWsEvent(body)
    if (!event) return

    if (event.kind === 'read') {
      if (event.readerId !== user?.id) {
        setMessages((prev) => applyReadStatus(prev, event.readAt, user?.id))
      }
      return
    }

    const msg = event.message
    if (!msg?.conversationId) return
    const fromOther = msg.senderId !== user?.id
    const isViewingThis = msg.conversationId === selectedIdRef.current

    if (isViewingThis) {
      setMessages((prev) => upsertMessage(prev, msg))
      if (fromOther) {
        chatApi.markAsRead(msg.conversationId).then(() => {
          window.dispatchEvent(new CustomEvent('chat-count-refresh'))
        }).catch(() => {})
      }
    }

    updateConversationPreview(msg.conversationId, msg)
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== msg.conversationId) return c
        const next = { ...c }
        if (fromOther && !isViewingThis) {
          next.unreadCount = (c.unreadCount ?? 0) + 1
          window.dispatchEvent(new CustomEvent('chat-count-refresh'))
        }
        return next
      })
    )
  }, [updateConversationPreview, user?.id])

  useStompChat(selectedId, handleWsEvent)

  const sendPayload = useCallback((payload) => {
    if (!selectedId || sending || isSystemChat) return Promise.resolve(null)
    setSending(true)
    return chatApi
      .sendMessage(selectedId, payload)
      .then((created) => {
        if (created) {
          setMessages((prev) => upsertMessage(prev, created))
          updateConversationPreview(selectedId, created)
        }
        return created
      })
      .catch(() => null)
      .finally(() => setSending(false))
  }, [selectedId, sending, isSystemChat, updateConversationPreview])

  const handleSend = (e) => {
    e.preventDefault()
    const text = sendText.trim()
    if (!text) return
    sendPayload({ text }).then(() => setSendText(''))
  }

  const handleSendAttachment = (attachmentUrl, messageType) => {
    setUploading(true)
    sendPayload({ text: '', attachmentUrl, messageType })
      .finally(() => setUploading(false))
  }

  const selectConversation = (id) => {
    setSelectedId(id)
    setSearchParams({ conversation: id }, { replace: true })
  }

  const handleBack = () => {
    setSelectedId(null)
    setSearchParams({}, { replace: true })
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

  const closeMobileThread = useCallback(() => {
    setSelectedId(null)
    setMessages([])
    setSearchParams({}, { replace: true })
  }, [setSearchParams])

  const applyConversationAfterRemove = useCallback((nextConversations) => {
    if (isMobile) {
      closeMobileThread()
      return
    }
    const nextId = nextConversations[0]?.id ?? null
    setSelectedId(nextId)
    setMessages([])
    setSearchParams(nextId ? { conversation: nextId } : {}, { replace: true })
  }, [isMobile, closeMobileThread, setSearchParams])

  const handleDeleteChat = () => {
    if (!selectedId || !window.confirm(t('chat.confirmDeleteChat'))) return
    setThreadMenuOpen(false)
    chatApi
      .deleteConversation(selectedId)
      .then(() => {
        const next = conversations.filter((c) => c.id !== selectedId)
        setConversations(next)
        applyConversationAfterRemove(next)
        window.dispatchEvent(new CustomEvent('chat-count-refresh'))
      })
      .catch(() => {})
  }

  const handleMute = () => {
    const nowMuted = toggleMuteConversation(selectedId)
    setMuted(nowMuted)
    setThreadMenuOpen(false)
    notifyToast('success', nowMuted ? t('chat.muted') : t('chat.unmuted'))
  }

  const handleBlock = () => {
    if (!selected?.otherPartyId) return
    if (!window.confirm(t('chat.confirmBlock'))) return
    blockUser(selected.otherPartyId)
    setThreadMenuOpen(false)
    notifyToast('success', t('chat.blocked'))
    const next = conversations.filter((c) => c.otherPartyId !== selected.otherPartyId)
    setConversations(next)
    applyConversationAfterRemove(next)
  }

  const handleReportOpen = () => {
    setThreadMenuOpen(false)
    setReportReason('')
    setReportModalOpen(true)
  }

  const handleReportSubmit = () => {
    if (!selected?.adId || !reportReason || reportSubmitting) return
    setReportSubmitting(true)
    adsApi
      .report(selected.adId, { reason: reportReason })
      .then(() => {
        notifyToast('success', t('notify.reportSent'))
        setReportModalOpen(false)
      })
      .catch(() => {})
      .finally(() => setReportSubmitting(false))
  }

  const threadTitle = isSystemChat
    ? t('chat.notifications')
    : (selected?.otherPartyName || '—')

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
    uploading,
    messageMenuId,
    setMessageMenuId,
    editingMessageId,
    editingText,
    setEditingText,
    messagesEndRef,
    messagesContainerRef,
    isSystemChat,
    threadTitle,
    threadMenuOpen,
    muted,
    reportModalOpen,
    reportReason,
    reportSubmitting,
    handleSend,
    handleSendAttachment,
    handleBack,
    selectConversation,
    handleDeleteMessage,
    handleStartEdit,
    handleSaveEdit,
    handleCancelEdit,
    handleDeleteChat,
    handleMute,
    handleBlock,
    handleReportOpen,
    handleReportSubmit,
    setReportModalOpen,
    setReportReason,
    setThreadMenuOpen,
  }
}
