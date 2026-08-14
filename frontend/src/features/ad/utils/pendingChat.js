const KEY = 'pending-chat-action'

export function setPendingChat(payload) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(payload))
  } catch {
    // ignore
  }
}

export function takePendingChat() {
  try {
    const raw = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.adId) return null
    return parsed
  } catch {
    return null
  }
}
