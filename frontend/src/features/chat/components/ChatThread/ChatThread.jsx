import { Link } from 'react-router-dom'
import UserAvatar from '@/components/ui/UserAvatar'
import { adsPath } from '@/constants/routes'
import { formatDateHeader, groupMessagesByDate } from '../../utils/chatFormat'
import { asMessageList } from '../../utils/chatListUtils'
import ChatMessage from '../ChatMessage'
import styles from './ChatThread.module.css'

export default function ChatThread({
  className,
  selected,
  selectedId,
  isSystemChat,
  threadTitle,
  threadSubtitle,
  messages,
  messagesLoading,
  user,
  sendText,
  sending,
  messageMenuId,
  editingMessageId,
  editingText,
  messagesEndRef,
  messagesContainerRef,
  onSend,
  onSendTextChange,
  onToggleMenu,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  onDeleteChat,
  onEditingTextChange,
  t,
}) {
  if (!selectedId) {
    return (
      <section className={className}>
        <div className={styles.threadEmpty}>
          <i className="bi bi-chat-square-text" aria-hidden />
          <p>{t('chat.selectConversation')}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={className}>
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
              onClick={onDeleteChat}
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
              return (
                <ChatMessage
                  key={m.id}
                  message={m}
                  isOwn={isOwn}
                  isSystemChat={isSystemChat}
                  displayName={isOwn ? t('chat.you') : (m.senderName || '—')}
                  avatar={isOwn ? user?.avatar : m.senderAvatar}
                  userName={user?.displayName || ''}
                  isEditing={editingMessageId === m.id}
                  menuOpen={messageMenuId === m.id}
                  editingText={editingText}
                  onEditingTextChange={onEditingTextChange}
                  onToggleMenu={(id) => onToggleMenu((prev) => (prev === id ? null : id))}
                  onStartEdit={onStartEdit}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onDelete={onDeleteMessage}
                  t={t}
                />
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>
        {isSystemChat ? (
          <div className={styles.readonlyBar}>{t('chat.systemReadonly')}</div>
        ) : (
          <form className={styles.composer} onSubmit={onSend}>
            <input
              type="text"
              className="form-control"
              placeholder={t('chat.placeholder')}
              value={sendText}
              onChange={(e) => onSendTextChange(e.target.value)}
              maxLength={2000}
              disabled={sending}
            />
            <button type="submit" className="btn btn-primary flex-shrink-0" disabled={sending || !sendText.trim()}>
              <i className="bi bi-send-fill" aria-hidden /> <span className="d-none d-sm-inline">{t('chat.send')}</span>
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
