/** Форматирование цен и дат — порт frontend/src/features/ad/utils/adFormatters.js */

export function formatPrice(price?: number | string | null, currency = 'UZS') {
  if (price == null) return '';
  const cur = String(currency || 'UZS').toUpperCase();
  if (cur === 'USD') {
    const n = Number(price);
    const rounded = Math.round(n * 100) / 100;
    return `${rounded.toLocaleString('ru-RU', { maximumFractionDigits: 2 })} USD`;
  }
  return `${Number(price).toLocaleString('ru-RU')} сум`;
}

export function formatDate(iso?: string | null) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Дата в ленте: «14 августа, 14:20» */
export function formatListDate(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const dayMonth = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  const time = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  return `${dayMonth}, ${time}`;
}

/** Компактная дата на карточке объявления: Bugun / Kecha / DD.MM.YYYY */
export function formatCardDate(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Kecha';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}
