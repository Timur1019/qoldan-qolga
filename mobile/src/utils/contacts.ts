/** Маска телефона для гостя / до раскрытия. */
export function maskPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const visible = digits.slice(-4);
  return `+${'*'.repeat(Math.max(digits.length - 4, 4))}${visible}`;
}

export function telUrl(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return `tel:+${digits}`;
}

/** Telegram: username или номер телефона. */
export function buildTelegramUrl(telegramUsername?: string | null, phone?: string | null): string | null {
  const username = telegramUsername?.trim();
  if (username) {
    return `https://t.me/${username.replace(/^@/, '')}`;
  }
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.length >= 9) {
    return `https://t.me/+${digits.slice(-12)}`;
  }
  return null;
}

export function hasTelegramContact(telegramUsername?: string | null, phone?: string | null): boolean {
  return !!buildTelegramUrl(telegramUsername, phone);
}
