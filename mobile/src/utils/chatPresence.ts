const ONLINE_MS = 5 * 60 * 1000;

function withParams(template: string, params: Record<string, string | number>) {
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    template
  );
}

export function isUserOnline(lastSeenAt?: string | null) {
  if (!lastSeenAt) return false;
  return Date.now() - new Date(lastSeenAt).getTime() < ONLINE_MS;
}

export function formatPresence(lastSeenAt: string | null | undefined, t: (key: string, fallback?: string) => string) {
  if (!lastSeenAt) return '';
  if (isUserOnline(lastSeenAt)) return t('chat.online', 'Tarmoqda');
  const diffMs = Date.now() - new Date(lastSeenAt).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) {
    return withParams(t('chat.lastSeenMinutes', '{n} daqiqa oldin'), { n: Math.max(1, minutes) });
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return withParams(t('chat.lastSeenHours', '{n} soat oldin'), { n: hours });
  const days = Math.floor(hours / 24);
  return withParams(t('chat.lastSeenDays', '{n} kun oldin'), { n: days });
}
