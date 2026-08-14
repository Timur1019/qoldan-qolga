export function formatTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDateHeader(dateStr, t) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return t('chat.today')
  if (d.toDateString() === new Date(now.getTime() - 86400000).toDateString()) return t('chat.yesterday')
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function groupMessagesByDate(messages) {
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
