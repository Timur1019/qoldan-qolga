const KEY = 'pending-chat-action'

export type PendingChat = { adId: string; text?: string }

export async function setPendingChat(payload: PendingChat) {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(KEY, JSON.stringify(payload))
      return
    }
  } catch {
    /* ignore */
  }
}

export function takePendingChat(): PendingChat | null {
  try {
    if (typeof sessionStorage === 'undefined') return null
    const raw = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PendingChat
    return parsed?.adId ? parsed : null
  } catch {
    return null
  }
}

export function asMessageList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[]
  if (data && typeof data === 'object' && Array.isArray((data as { content?: unknown }).content)) {
    return (data as { content: T[] }).content
  }
  return []
}

export function upsertMessage<T extends { id?: string }>(list: T[], msg: T) {
  if (!msg?.id) return list
  const idx = list.findIndex((m) => m.id === msg.id)
  if (idx >= 0) return list.map((m, i) => (i === idx ? msg : m))
  return [...list, msg]
}
