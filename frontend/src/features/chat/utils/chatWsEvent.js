export function parseChatWsEvent(body) {
  if (!body || typeof body !== 'object') return null
  if (body.type === 'MESSAGE' && body.message) {
    return { kind: 'message', message: body.message }
  }
  if (body.type === 'READ') {
    return { kind: 'read', readerId: body.readerId, readAt: body.readAt }
  }
  if (body.id && body.conversationId) {
    return { kind: 'message', message: body }
  }
  return null
}

export function applyReadStatus(messages, readAt, currentUserId) {
  if (!readAt || !currentUserId) return messages
  const readTime = new Date(readAt).getTime()
  return messages.map((m) => {
    if (m.senderId !== currentUserId) return m
    const created = m.createdAt ? new Date(m.createdAt).getTime() : 0
    if (created <= readTime) {
      return { ...m, status: 'READ' }
    }
    return m.status === 'READ' ? m : { ...m, status: m.status || 'DELIVERED' }
  })
}
