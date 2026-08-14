export const SYSTEM_AD_ID = '00000000-0000-0000-0000-000000000002';

export function isSystemConversation(conversation?: { adId?: string } | null) {
  return conversation?.adId === SYSTEM_AD_ID;
}
