/**
 * Нормализация телефона к цифрам для API (998…).
 * Локальные 9 цифр (90…, 88…, 33…) дополняются кодом 998.
 */
export function normalizePhoneInput(raw: string): string {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('998') && digits.length >= 12) return digits.slice(0, 12);
  if (digits.startsWith('998')) return digits;
  if (digits.length === 9) return `998${digits}`;
  if (digits.startsWith('8') && digits.length === 10) return `998${digits.slice(1)}`;
  return digits;
}

export function formatPhoneDisplay(normalized: string): string {
  const d = normalizePhoneInput(normalized);
  if (d.startsWith('998') && d.length >= 12) {
    return `+998 ${d.slice(3, 5)} ${d.slice(5, 8)} ${d.slice(8, 10)} ${d.slice(10, 12)}`.trim();
  }
  if (d.startsWith('998')) {
    return `+998 ${d.slice(3)}`.trim();
  }
  return d ? `+${d}` : '';
}

export function isValidUzPhone(normalized: string): boolean {
  return /^998\d{9}$/.test(normalizePhoneInput(normalized));
}
