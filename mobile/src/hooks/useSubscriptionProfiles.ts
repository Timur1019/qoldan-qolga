import { useCallback, useState } from 'react';

import { usersApi } from '@/api/client';
import type { SubscriptionProfile } from '@/components/Favorites/SubscriptionProfileRow';

/** Загрузка и отписка для вкладки «Профили». */
export function useSubscriptionProfiles(enabled: boolean) {
  const [profiles, setProfiles] = useState<SubscriptionProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    if (!enabled) {
      setProfiles([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    usersApi
      .getMySubscriptions()
      .then((list) => setProfiles(Array.isArray(list) ? (list as SubscriptionProfile[]) : []))
      .catch(() => setProfiles([]))
      .finally(() => setLoading(false));
  }, [enabled]);

  const unsubscribe = useCallback((profileId: string) => {
    usersApi
      .unsubscribe(profileId)
      .then(() => {
        setProfiles((prev) => prev.filter((p) => String(p.id) !== String(profileId)));
      })
      .catch(() => {});
  }, []);

  return { profiles, loading, load, unsubscribe };
}
