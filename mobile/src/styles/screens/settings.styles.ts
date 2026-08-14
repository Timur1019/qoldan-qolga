import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSubtle },
  content: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  card: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLast: { borderBottomWidth: 0 },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  version: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 13,
    marginTop: spacing.lg,
  },
  spacer: { flex: 1, minHeight: 24 },
  logoutBtn: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.bg,
  },
  logoutText: { color: colors.error, fontWeight: '700', fontSize: 15 },
  deleteBtn: {
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.bgMuted,
  },
  deleteText: { color: colors.text, fontWeight: '600', fontSize: 15 },
});
