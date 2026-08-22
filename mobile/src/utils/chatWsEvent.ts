import type { MessageDto } from '@/types/api';

export type ChatWsEvent =
  | { kind: 'message'; message: MessageDto }
  | { kind: 'read'; readerId?: string; readAt?: string };

export function parseChatWsEvent(body: unknown): ChatWsEvent | null {
  if (!body || typeof body !== 'object') return null;
  const record = body as Record<string, unknown>;
  if (record.type === 'MESSAGE' && record.message && typeof record.message === 'object') {
    return { kind: 'message', message: record.message as MessageDto };
  }
  if (record.type === 'READ') {
    return {
      kind: 'read',
      readerId: typeof record.readerId === 'string' ? record.readerId : undefined,
      readAt: typeof record.readAt === 'string' ? record.readAt : undefined,
    };
  }
  if (typeof record.id === 'string' && typeof record.conversationId === 'string') {
    return { kind: 'message', message: record as unknown as MessageDto };
  }
  return null;
}

export function applyReadStatus(messages: MessageDto[], readAt: string | undefined, currentUserId?: string) {
  if (!readAt || !currentUserId) return messages;
  const readTime = new Date(readAt).getTime();
  return messages.map((m) => {
    if (m.senderId !== currentUserId) return m;
    const created = m.createdAt ? new Date(m.createdAt).getTime() : 0;
    if (created <= readTime) return { ...m, status: 'READ' as const };
    return m.status === 'READ' ? m : { ...m, status: m.status || 'DELIVERED' };
  });
}
