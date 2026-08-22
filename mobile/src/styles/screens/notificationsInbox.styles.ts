import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSubtle },
  list: { paddingBottom: spacing.xl },
  empty: {
    paddingHorizontal: spacing.lg,
    paddingTop: 48,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  loader: { marginTop: 48 },
  footerLoader: { paddingVertical: 16 },
  markAll: { color: colors.primary, fontSize: 14, fontWeight: '600', marginRight: 4 },
  loginBtn: {
    marginTop: 16,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  loginBtnText: { color: colors.white, fontWeight: '700', fontSize: 14 },
});
