import ChatAdCard from '../ChatAdCard'
import ChatComposer from '../ChatComposer'
import ChatThreadHeader from '../ChatThreadHeader'
import { formatDateHeader, groupMessagesByDate } from '../../utils/chatFormat'
import { asMessageList } from '../../utils/chatListUtils'
import ChatMessage from '../ChatMessage'
import styles from './ChatThread.module.css'

export default function ChatThread({
  className,
  selected,
  selectedId,
  isSystemChat,
  isMobile,
  threadTitle,
  messages,
  messagesLoading,
  user,
  sendText,
  sending,
  uploading,
  messageMenuId,
  editingMessageId,
  editingText,
  threadMenuOpen,
  muted,
  messagesEndRef,
  messagesContainerRef,
  onBack,
  onSend,
  onSendTextChange,
  onQuickReply,
  onSendAttachment,
  onToggleMenu,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onDeleteMessage,
  onToggleThreadMenu,
  onCloseThreadMenu,
  onMute,
  onBlock,
  onReport,
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
        {selected?.adId && !isSystemChat && (
          <ChatAdCard
            adId={selected.adId}
            title={selected.adTitle}
            imageUrl={selected.adImageUrl}
            price={selected.adPrice}
            currency={selected.adCurrency}
            region={selected.adRegion}
            compact={isMobile}
            t={t}
          />
        )}
        <ChatThreadHeader
          isSystemChat={isSystemChat}
          isMobile={isMobile}
          isTopBar={isMobile}
          title={threadTitle}
          subtitle={selected?.adTitle}
          avatar={selected?.otherPartyAvatar}
          lastSeenAt={selected?.otherPartyLastSeenAt}
          isTyping={false}
          menuOpen={threadMenuOpen}
          muted={muted}
          onBack={onBack}
          onToggleMenu={onToggleThreadMenu}
          onCloseMenu={onCloseThreadMenu}
          onMute={onMute}
          onBlock={onBlock}
          onReport={onReport}
          onDelete={onDeleteChat}
          t={t}
        />
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
          <ChatComposer
            sendText={sendText}
            sending={sending}
            uploading={uploading}
            onSendTextChange={onSendTextChange}
            onQuickReply={onQuickReply}
            onSubmit={onSend}
            onSendAttachment={onSendAttachment}
            t={t}
          />
        )}
      </div>
    </section>
  )
}
