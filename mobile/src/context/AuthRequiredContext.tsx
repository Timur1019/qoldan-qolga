import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface AuthRequiredContextValue {
  visible: boolean;
  openAuthRequired: () => void;
  closeAuthRequired: () => void;
}

const AuthRequiredContext = createContext<AuthRequiredContextValue | null>(null);

export function AuthRequiredProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const openAuthRequired = useCallback(() => setVisible(true), []);
  const closeAuthRequired = useCallback(() => setVisible(false), []);

  const value = useMemo(
    () => ({ visible, openAuthRequired, closeAuthRequired }),
    [visible, openAuthRequired, closeAuthRequired]
  );

  return <AuthRequiredContext.Provider value={value}>{children}</AuthRequiredContext.Provider>;
}

export function useAuthRequired() {
  const ctx = useContext(AuthRequiredContext);
  if (!ctx) throw new Error('useAuthRequired must be used within AuthRequiredProvider');
  return ctx;
}
