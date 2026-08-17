import useChatPage from '../../hooks/useChatPage'
import ConversationList from '../../components/ConversationList'
import ChatThread from '../../components/ChatThread'
import styles from './Chat.module.css'

export default function Chat() {
  const chat = useChatPage()

  if (chat.loading) {
    return (
      <div className="page-container app-page">
        <p>{chat.t('common.loading')}</p>
      </div>
    )
  }

  if (chat.error) {
    return (
      <div className="page-container app-page">
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle me-2" aria-hidden /> {chat.error}
        </div>
      </div>
    )
  }

  const { isMobile, selectedId, t } = chat

  return (
    <div className={isMobile ? styles.mobilePage : 'page-container app-page'}>
      {!isMobile && <h1 className="h2 mb-3">{t('profile.chat')}</h1>}
      <div className={`${styles.layout} ${isMobile && selectedId ? styles.threadOpen : ''} ${isMobile ? '' : 'app-card border-0 shadow-sm overflow-hidden'}`}>
        <aside className={styles.sidebar}>
          <ConversationList
            conversations={chat.conversations}
            selectedId={selectedId}
            onSelect={chat.selectConversation}
            t={t}
          />
        </aside>
        <ChatThread
          className={styles.thread}
          selected={chat.selected}
          selectedId={selectedId}
          isSystemChat={chat.isSystemChat}
          threadTitle={chat.threadTitle}
          threadSubtitle={chat.threadSubtitle}
          messages={chat.messages}
          messagesLoading={chat.messagesLoading}
          user={chat.user}
          sendText={chat.sendText}
          sending={chat.sending}
          messageMenuId={chat.messageMenuId}
          editingMessageId={chat.editingMessageId}
          editingText={chat.editingText}
          messagesEndRef={chat.messagesEndRef}
          messagesContainerRef={chat.messagesContainerRef}
          onSend={chat.handleSend}
          onSendTextChange={chat.setSendText}
          onToggleMenu={chat.setMessageMenuId}
          onStartEdit={chat.handleStartEdit}
          onSaveEdit={chat.handleSaveEdit}
          onCancelEdit={chat.handleCancelEdit}
          onDeleteMessage={chat.handleDeleteMessage}
          onDeleteChat={chat.handleDeleteChat}
          onEditingTextChange={chat.setEditingText}
          t={t}
        />
      </div>
    </div>
  )
}
