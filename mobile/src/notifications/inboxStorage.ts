import * as FileSystem from 'expo-file-system/legacy';

export type PushInboxItem = {
  id: string;
  title: string;
  body: string;
  receivedAt: number;
  read: boolean;
  conversationId?: string;
  adId?: string;
};

const FILE = `${FileSystem.documentDirectory || ''}push-inbox.json`;
const MAX_ITEMS = 50;

async function readAll(): Promise<PushInboxItem[]> {
  try {
    const info = await FileSystem.getInfoAsync(FILE);
    if (!info.exists) return [];
    const raw = await FileSystem.readAsStringAsync(FILE);
    const parsed = JSON.parse(raw) as PushInboxItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(items: PushInboxItem[]) {
  await FileSystem.writeAsStringAsync(FILE, JSON.stringify(items.slice(0, MAX_ITEMS)));
}

export async function loadPushInbox() {
  return readAll();
}

export async function savePushInboxItem(item: PushInboxItem) {
  const items = await readAll();
  const next = [item, ...items.filter((x) => x.id !== item.id)].slice(0, MAX_ITEMS);
  await writeAll(next);
  return next;
}

export async function markPushInboxRead(id?: string) {
  const items = await readAll();
  const next = items.map((x) => (id && x.id !== id ? x : { ...x, read: true }));
  await writeAll(next);
  return next;
}

export function unreadPushCount(items: PushInboxItem[]) {
  return items.reduce((n, x) => n + (x.read ? 0 : 1), 0);
}
