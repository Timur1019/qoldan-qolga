const MUTED_KEY = 'chat-muted-conversations'
const BLOCKED_KEY = 'chat-blocked-users'

function readJson(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function getMutedConversationIds() {
  return new Set(readJson(MUTED_KEY))
}

export function toggleMuteConversation(conversationId) {
  const set = getMutedConversationIds()
  if (set.has(conversationId)) set.delete(conversationId)
  else set.add(conversationId)
  writeJson(MUTED_KEY, [...set])
  return set.has(conversationId)
}

export function isConversationMuted(conversationId) {
  return getMutedConversationIds().has(conversationId)
}

export function getBlockedUserIds() {
  return new Set(readJson(BLOCKED_KEY))
}

export function blockUser(userId) {
  const set = getBlockedUserIds()
  set.add(userId)
  writeJson(BLOCKED_KEY, [...set])
}

export function isUserBlocked(userId) {
  return userId ? getBlockedUserIds().has(userId) : false
}
