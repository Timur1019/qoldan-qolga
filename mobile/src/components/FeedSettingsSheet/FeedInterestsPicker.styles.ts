import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: { gap: spacing.sm, minHeight: 220 },
  selectedWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    maxWidth: '100%',
  },
  selectedText: { color: colors.white, fontSize: 12, fontWeight: '600', maxWidth: 160 },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  backText: { fontSize: 14, fontWeight: '700', color: colors.primary },
  levelHint: { fontSize: 12, color: colors.muted },
  list: { maxHeight: 320 },
  loader: { marginVertical: spacing.lg },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  checkHit: { padding: 2 },
  rowMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowText: { flex: 1, fontSize: 15, color: colors.text },
  rowTextOn: { fontWeight: '700', color: colors.primary },
  empty: { textAlign: 'center', color: colors.muted, marginTop: spacing.md },
});
