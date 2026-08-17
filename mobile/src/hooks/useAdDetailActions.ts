import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

import { adsApi, chatApi, isAuthError, usersApi } from '@/api/client';
import type { SellerProfileLite } from '@/hooks/useAdDetail';
import type { AdDetailDto } from '@/types/api';
import { buildTelegramUrl, telUrl } from '@/utils/contacts';
import { setPendingChat, takePendingChat } from '@/utils/pendingChat';
import { openExternalUrl } from '@/utils/openExternalUrl';

type Args = {
  ad: AdDetailDto | null | undefined;
  isAuthenticated: boolean;
  userId?: string;
  requireAuth: (fn?: () => void) => void;
  setAd: Dispatch<SetStateAction<AdDetailDto | null>>;
  setSellerProfile: Dispatch<SetStateAction<SellerProfileLite | null>>;
};

export function useAdDetailActions({
  ad,
  isAuthenticated,
  userId,
  requireAuth,
  setAd,
  setSellerProfile,
}: Args) {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [creatingChat, setCreatingChat] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const toggleFavorite = useCallback(() => {
    if (!ad) return;
    requireAuth(() => {
      adsApi
        .toggleFavorite(ad.id)
        .then((favorite) => setAd((prev) => (prev ? { ...prev, favorite: !!favorite } : prev)))
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        });
    });
  }, [ad, requireAuth, setAd]);

  const openChat = useCallback(() => {
    if (!ad) return;
    if (!isAuthenticated) {
      void setPendingChat({ adId: ad.id });
      requireAuth();
      return;
    }
    requireAuth(() => {
      setCreatingChat(true);
      chatApi
        .getOrCreateConversation(ad.id)
        .then((conv) => {
          const c = conv as { id: string };
          router.push(`/chat/${c.id}`);
        })
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
          else Alert.alert('Xatolik', err instanceof Error ? err.message : 'Chat ochilmadi');
        })
        .finally(() => setCreatingChat(false));
    });
  }, [ad, isAuthenticated, requireAuth]);

  useEffect(() => {
    if (!isAuthenticated || !ad?.id || userId === ad.userId) return;
    const pending = takePendingChat();
    if (!pending?.adId) return;
    if (pending.adId !== ad.id) {
      void setPendingChat(pending);
      return;
    }
    setCreatingChat(true);
    chatApi
      .getOrCreateConversation(ad.id)
      .then(async (conv) => {
        const c = conv as { id: string };
        if (pending.text) {
          await chatApi.sendMessage(c.id, pending.text);
        }
        router.push(`/chat/${c.id}`);
      })
      .catch(() => {})
      .finally(() => setCreatingChat(false));
  }, [ad?.id, ad?.userId, isAuthenticated, userId]);

  const onPhone = useCallback(() => {
    if (!ad?.phone) return;
    requireAuth(() => {
      if (phoneRevealed) {
        void openExternalUrl(telUrl(ad.phone), 'Telefon chaqiruvi mavjud emas');
      } else setPhoneRevealed(true);
    });
  }, [ad, phoneRevealed, requireAuth]);

  const onTelegram = useCallback(() => {
    if (!ad) return;
    const url = buildTelegramUrl(ad.telegramUsername, ad.phone);
    if (!url) return;
    requireAuth(() => {
      void openExternalUrl(url);
    });
  }, [ad, requireAuth]);

  const toggleSubscribe = useCallback(() => {
    if (!ad?.userId) return;
    requireAuth(() => {
      setSubscribing(true);
      usersApi
        .toggleSubscribe(ad.userId)
        .then((subscribed) => {
          setSellerProfile((prev) => ({ ...(prev || {}), subscribed: !!subscribed }));
        })
        .catch((err) => {
          if (isAuthError(err)) requireAuth();
        })
        .finally(() => setSubscribing(false));
    });
  }, [ad?.userId, requireAuth, setSellerProfile]);

  return {
    phoneRevealed,
    creatingChat,
    subscribing,
    toggleFavorite,
    openChat,
    onPhone,
    onTelegram,
    toggleSubscribe,
  };
}
