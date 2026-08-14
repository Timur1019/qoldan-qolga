import type { MessageDto } from '@/types/api';

/** Время в списке чатов: сегодня — часы, иначе дата. */
export function formatChatListTime(iso?: string | null) {
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
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

/** Время под пузырём. */
export function formatMessageTime(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
}

export function formatChatDateHeader(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Bugun';
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return 'Kecha';
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export type ChatListItem =
  | { type: 'date'; key: string; createdAt: string }
  | { type: 'msg'; key: string; msg: MessageDto };

export function groupMessagesByDate(messages: MessageDto[]): ChatListItem[] {
  const groups: ChatListItem[] = [];
  let currentDate = '';
  for (const m of messages) {
    const dateKey = m.createdAt ? new Date(m.createdAt).toDateString() : '';
    if (dateKey && dateKey !== currentDate) {
      currentDate = dateKey;
      groups.push({ type: 'date', key: `d-${dateKey}`, createdAt: m.createdAt });
    }
    groups.push({ type: 'msg', key: m.id, msg: m });
  }
  return groups;
}
