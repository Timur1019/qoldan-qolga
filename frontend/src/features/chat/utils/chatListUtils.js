export function asMessageList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.content)) return data.content
  return []
}

export function upsertMessage(list, msg) {
  if (!msg?.id) return list
  const idx = list.findIndex((m) => m.id === msg.id)
  if (idx >= 0) return list.map((m, i) => (i === idx ? msg : m))
  return [...list, msg]
}

