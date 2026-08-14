import { useCallback } from 'react';

import { useAuth } from '@/context/AuthContext';
import { useAuthRequired } from '@/context/AuthRequiredContext';

/**
 * Если гость — открывает AuthRequiredSheet и не вызывает action.
 * Если авторизован — выполняет action.
 * isAuthenticated читается через актуальное замыкание (deps).
 */
export function useRequireAuth() {
  const { isAuthenticated } = useAuth();
  const { openAuthRequired } = useAuthRequired();

  return useCallback(
    (action?: () => void) => {
      if (!isAuthenticated) {
        openAuthRequired();
        return false;
      }
      action?.();
      return true;
    },
    [isAuthenticated, openAuthRequired]
  );
}
