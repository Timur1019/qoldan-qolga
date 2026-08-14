import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { formatPrice } from '@/utils/formatters';
import {
  clearPriceWatch,
  isPriceWatched,
  setPriceWatch,
  syncPriceWatch,
} from '@/utils/priceWatchStorage';

export function usePriceWatch(ad: { id: string; price?: number; currency?: string; title?: string } | null) {
  const { isAuthenticated, user } = useAuth();
  const requireAuth = useRequireAuth();
  const { t } = useLanguage();
  const userId = user?.id;
  const [watching, setWatching] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !userId || !ad?.id) {
      setWatching(false);
      return;
    }
    void isPriceWatched(userId, ad.id).then(setWatching);
  }, [ad?.id, isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated || !userId || !ad?.id || !watching) return;
    void syncPriceWatch(userId, ad).then((change) => {
      if (!change) return;
      const amount = formatPrice(Math.abs(change.nextPrice - change.prevPrice), change.currency);
      Alert.alert(
        t('ads.trackPrice'),
        change.dropped
          ? t('notify.priceWatchDropped').replace('{amount}', amount)
          : t('notify.priceWatchRose').replace('{amount}', amount)
      );
    });
  }, [ad?.id, ad?.price, isAuthenticated, t, userId, watching]);

  const toggle = useCallback(() => {
    if (!ad?.id) return;
    requireAuth(() => {
      void (async () => {
        if (!userId) return;
        if (await isPriceWatched(userId, ad.id)) {
          await clearPriceWatch(userId, ad.id);
          setWatching(false);
          Alert.alert(t('ads.trackPrice'), t('notify.priceWatchOff'));
          return;
        }
        await setPriceWatch(userId, ad);
        setWatching(true);
        Alert.alert(t('ads.trackPrice'), t('notify.priceWatchOn'));
      })();
    });
  }, [ad, requireAuth, t, userId]);

  return { watching, toggle };
}
