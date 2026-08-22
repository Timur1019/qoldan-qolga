import { useRef, useState } from 'react'
import { adsApi } from '@/api/ads'
import ChatQuickReplies from '../ChatQuickReplies'
import styles from './ChatComposer.module.css'

const EMOJIS = ['😊', '👍', '🙏', '✅', '❤️', '😂', '🔥', '💯']

export default function ChatComposer({
  sendText,
  sending,
  uploading,
  onSendTextChange,
  onQuickReply,
  onSubmit,
  onSendAttachment,
  t,
}) {
  const fileRef = useRef(null)
  const cameraRef = useRef(null)
  const [emojiOpen, setEmojiOpen] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || sending || uploading) return
    try {
      const data = await adsApi.upload(file)
      if (data?.url) {
        const type = file.type.startsWith('image/') ? 'IMAGE' : 'FILE'
        onSendAttachment(data.url, type)
      }
    } catch {
      // toast handled by api layer
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(e)
  }

  return (
    <div className={styles.composer}>
      <ChatQuickReplies onSelect={onQuickReply} t={t} />
      {uploading ? <div className={styles.uploading}>{t('chat.uploading')}</div> : null}
      {emojiOpen && (
        <div className={styles.emojiPanel}>
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className={styles.emojiBtn}
              onClick={() => {
                onSendTextChange((sendText || '') + emoji)
                setEmojiOpen(false)
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.tools}>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => fileRef.current?.click()}
            disabled={sending || uploading}
            aria-label={t('chat.attachFile')}
          >
            <i className="bi bi-paperclip" aria-hidden />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => cameraRef.current?.click()}
            disabled={sending || uploading}
            aria-label={t('chat.attachPhoto')}
          >
            <i className="bi bi-camera" aria-hidden />
          </button>
          <button
            type="button"
            className={styles.toolBtn}
            onClick={() => setEmojiOpen((v) => !v)}
            disabled={sending}
            aria-label={t('chat.emoji')}
          >
            <i className="bi bi-emoji-smile" aria-hidden />
          </button>
        </div>
        <div className={styles.inputWrap}>
          <input
            type="text"
            className={styles.input}
            placeholder={t('chat.placeholder')}
            value={sendText}
            onChange={(e) => onSendTextChange(e.target.value)}
            maxLength={2000}
            disabled={sending || uploading}
          />
        </div>
        <button
          type="button"
          className={styles.toolBtn}
          disabled
          title={t('chat.voiceSoon')}
          aria-label={t('chat.voiceMessage')}
        >
          <i className="bi bi-mic" aria-hidden />
        </button>
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={sending || uploading || !sendText.trim()}
          aria-label={t('chat.send')}
        >
          <i className="bi bi-send-fill" aria-hidden />
        </button>
        <input ref={fileRef} type="file" className={styles.hiddenInput} onChange={handleFile} />
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" className={styles.hiddenInput} onChange={handleFile} />
      </form>
    </div>
  )
}
