import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loader: { marginTop: 40 },
  header: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  avatarWrap: { marginBottom: spacing.sm },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  avatarPlaceholder: {
    backgroundColor: colors.bgSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: { fontSize: 36 },
  avatarInitials: { fontSize: 28, fontWeight: '700', color: colors.primary },
  name: { fontSize: 20, fontWeight: '700', color: colors.text },
  role: { fontSize: 14, color: colors.muted },
  since: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  stats: { marginTop: spacing.sm, gap: 2, alignItems: 'center' },
  statItem: { fontSize: 13, color: colors.textSecondary },
  badge: {
    marginTop: spacing.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.bgMuted,
  },
  badgeOk: { backgroundColor: '#e8f5ee' },
  badgeOff: { backgroundColor: colors.bgMuted },
  badgeText: { fontSize: 12, fontWeight: '600', color: colors.muted },
  badgeTextOk: { color: colors.primary },
  subscribeBtn: {
    marginTop: spacing.md,
    minWidth: 180,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  subscribeBtnOn: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  subscribeText: { color: colors.white, fontWeight: '700', fontSize: 14 },
  subscribeTextOn: { color: colors.primary },
  list: { paddingHorizontal: spacing.md, paddingBottom: 40 },
  row: { gap: spacing.sm },
  gridItem: { flex: 1, maxWidth: '50%' },
  empty: { textAlign: 'center', marginTop: 40, color: colors.muted },
});
