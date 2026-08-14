import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  tab: { paddingVertical: 12, marginRight: spacing.xl },
  tabOn: { borderBottomWidth: 2, borderBottomColor: colors.text },
  tabText: { fontSize: 15, color: colors.muted, fontWeight: '600' },
  tabTextOn: { color: colors.text },
  guestWrap: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  guestTitle: { fontSize: 18, fontWeight: '700', color: colors.text, textAlign: 'center' },
  guestText: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  primaryBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: 28,
    alignItems: 'center',
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  primaryBtnText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  list: { paddingHorizontal: 8, paddingBottom: 24 },
  profilesList: { paddingTop: spacing.md, paddingBottom: 24, flexGrow: 1 },
  row: { gap: 8 },
  gridItem: { flex: 1, maxWidth: '50%' },
  loader: { marginTop: 24 },
  empty: { textAlign: 'center', marginTop: 40, color: colors.muted },
  emptyTitle: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    paddingHorizontal: spacing.xl,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.bg },
  skeletonWrap: { padding: spacing.lg, gap: spacing.md },
  profileSkeleton: { height: 72, borderRadius: radius.lg },
});
