import { useCallback, useState } from 'react';

import { fetchUnreadCount } from '@/api/notifications';

export function useNotificationUnreadCount(isAuthenticated: boolean) {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setCount(0);
      return;
    }
    try {
      setCount(await fetchUnreadCount());
    } catch {
      setCount(0);
    }
  }, [isAuthenticated]);

  return { count, refresh, setCount };
}
