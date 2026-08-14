/** Строки адреса/ориентира, которые раньше вшивались в description. */
const ADDRESS_LINE_RE = /^(?:Адрес|Manzil)\s*:\s*(.+)$/i
const LANDMARK_LINE_RE = /^(?:Ориентир|Yo['’]?nalish)\s*:\s*(.+)$/i

/**
 * Убирает из текста блоки Manzil/Адрес/Ориентир и возвращает поля формы.
 * @param {string} raw
 * @returns {{ description: string, address: string, landmark: string }}
 */
export function extractLocationFromDescription(raw) {
  const text = (raw || '').replace(/\r\n/g, '\n').trim()
  if (!text) return { description: '', address: '', landmark: '' }

  const lines = text.split('\n')
  let address = ''
  let landmark = ''
  const kept = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) {
      kept.push(line)
      continue
    }
    const addrMatch = trimmed.match(ADDRESS_LINE_RE)
    if (addrMatch) {
      address = addrMatch[1].trim()
      continue
    }
    const landmarkMatch = trimmed.match(LANDMARK_LINE_RE)
    if (landmarkMatch) {
      landmark = landmarkMatch[1].trim()
      continue
    }
    kept.push(line)
  }

  const description = kept
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  return { description, address, landmark }
}

/**
 * Добавляет адрес/ориентир в конец описания (один раз, без дублей).
 * @param {string} description
 * @param {{ address?: string, landmark?: string, lang?: string }} opts
 */
export function appendLocationToDescription(description, { address, landmark, lang } = {}) {
  const cleaned = extractLocationFromDescription(description).description
  const addr = (address || '').trim()
  const mark = (landmark || '').trim()
  if (!addr && !mark) return cleaned

  const parts = []
  if (addr) parts.push(lang === 'ru' ? `Адрес: ${addr}` : `Manzil: ${addr}`)
  if (mark) parts.push(lang === 'ru' ? `Ориентир: ${mark}` : `Yo'nalish: ${mark}`)

  return cleaned ? `${cleaned}\n\n${parts.join('\n')}` : parts.join('\n')
}

/**
 * Текст описания без вшитого адреса (для карточки объявления).
 * @param {string} raw
 */
export function descriptionWithoutLocation(raw) {
  return extractLocationFromDescription(raw).description
}
