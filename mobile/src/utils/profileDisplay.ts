/** Формат телефона для профиля. */
export function formatProfilePhone(phone?: string | null) {
  if (!phone) return '';
  const digits = String(phone).replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
  }
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 7)}-${digits.slice(7)}`;
  }
  if (String(phone).startsWith('+')) return String(phone);
  return digits ? `+${digits}` : '';
}

export function profileInitials(name?: string | null) {
  const raw = (name || '').trim();
  if (!raw) return '?';
  const parts = raw.split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return raw.slice(0, 2).toUpperCase();
}
