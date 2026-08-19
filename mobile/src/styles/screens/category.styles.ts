import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  list: { paddingBottom: 24 },
  crumbRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignItems: 'center',
  },
  crumbItem: { flexDirection: 'row', alignItems: 'center' },
  crumbText: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  crumbSep: { fontSize: 13, color: colors.muted },
  subChips: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  subChipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  subChip: {
    backgroundColor: colors.bgMuted,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  subChipText: { fontSize: 13, fontWeight: '600', color: colors.text },
  subChipOn: { backgroundColor: colors.primary },
  subChipTextOn: { color: colors.white },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
  },
  countText: { fontSize: 13, color: colors.muted, fontWeight: '600' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterBtnOn: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterBtnText: { fontSize: 13, fontWeight: '700', color: colors.primary },
  filterBtnTextOn: { color: colors.white },
  loader: { marginTop: 24 },
  empty: { textAlign: 'center', marginTop: 40, color: colors.muted },
  refreshVeil: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.42)',
  },
});
