import AdReportModal from '@/features/ad/components/AdReportModal'
import useChatPage from '../../hooks/useChatPage'
import ConversationList from '../../components/ConversationList'
import ChatThread from '../../components/ChatThread'
import styles from './Chat.module.css'

export default function Chat() {
  const chat = useChatPage()
  const pageClass = chat.isMobile ? styles.mobilePage : 'page-container app-page'

  if (chat.loading) {
    return (
      <div className={pageClass}>
        <p>{chat.t('common.loading')}</p>
      </div>
    )
  }

  if (chat.error) {
    return (
      <div className={pageClass}>
        <div className="alert alert-danger mb-0" role="alert">
          <i className="bi bi-exclamation-triangle me-2" aria-hidden /> {chat.error}
        </div>
      </div>
    )
  }

  const { isMobile, selectedId, t } = chat

  return (
      <div className={pageClass}>
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
          isMobile={isMobile}
          threadTitle={chat.threadTitle}
          messages={chat.messages}
          messagesLoading={chat.messagesLoading}
          user={chat.user}
          sendText={chat.sendText}
          sending={chat.sending}
          uploading={chat.uploading}
          messageMenuId={chat.messageMenuId}
          editingMessageId={chat.editingMessageId}
          editingText={chat.editingText}
          threadMenuOpen={chat.threadMenuOpen}
          muted={chat.muted}
          messagesEndRef={chat.messagesEndRef}
          messagesContainerRef={chat.messagesContainerRef}
          onBack={chat.handleBack}
          onSend={chat.handleSend}
          onSendTextChange={chat.setSendText}
          onQuickReply={chat.setSendText}
          onSendAttachment={chat.handleSendAttachment}
          onToggleMenu={chat.setMessageMenuId}
          onStartEdit={chat.handleStartEdit}
          onSaveEdit={chat.handleSaveEdit}
          onCancelEdit={chat.handleCancelEdit}
          onDeleteMessage={chat.handleDeleteMessage}
          onToggleThreadMenu={() => chat.setThreadMenuOpen((v) => !v)}
          onCloseThreadMenu={() => chat.setThreadMenuOpen(false)}
          onMute={chat.handleMute}
          onBlock={chat.handleBlock}
          onReport={chat.handleReportOpen}
          onDeleteChat={chat.handleDeleteChat}
          onEditingTextChange={chat.setEditingText}
          t={t}
        />
      </div>
      <AdReportModal
        open={chat.reportModalOpen}
        reason={chat.reportReason}
        submitting={chat.reportSubmitting}
        onReasonChange={chat.setReportReason}
        onClose={() => chat.setReportModalOpen(false)}
        onSubmit={chat.handleReportSubmit}
        t={t}
      />
    </div>
  )
}
