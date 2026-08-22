import * as SecureStore from 'expo-secure-store';

const MUTED_KEY = 'chat_muted_conversations';
const BLOCKED_KEY = 'chat_blocked_users';

async function readSet(key: string): Promise<Set<string>> {
  try {
    const raw = await SecureStore.getItemAsync(key);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

async function writeSet(key: string, set: Set<string>) {
  await SecureStore.setItemAsync(key, JSON.stringify([...set]));
}

export async function getMutedConversationIds() {
  return readSet(MUTED_KEY);
}

export async function toggleMuteConversation(conversationId: string) {
  const set = await readSet(MUTED_KEY);
  if (set.has(conversationId)) set.delete(conversationId);
  else set.add(conversationId);
  await writeSet(MUTED_KEY, set);
  return set.has(conversationId);
}

export async function isConversationMuted(conversationId: string) {
  const set = await readSet(MUTED_KEY);
  return set.has(conversationId);
}

export async function getBlockedUserIds() {
  return readSet(BLOCKED_KEY);
}

export async function blockUser(userId: string) {
  const set = await readSet(BLOCKED_KEY);
  set.add(userId);
  await writeSet(BLOCKED_KEY, set);
}

export async function isUserBlocked(userId: string) {
  if (!userId) return false;
  const set = await readSet(BLOCKED_KEY);
  return set.has(userId);
}
