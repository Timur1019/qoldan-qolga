import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  deliverRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  deliverText: { fontSize: 13, color: colors.muted },
  mapWrap: {
    height: 180,
    borderRadius: radius.md,
    overflow: 'hidden',
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  map: { flex: 1, backgroundColor: colors.bgSubtle },
  line: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  lineBody: { flex: 1, gap: 2 },
  lineMain: { fontSize: 14, fontWeight: '600', color: colors.text },
  lineSub: { fontSize: 12, color: colors.muted },
  openMaps: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  openMapsText: { fontSize: 13, fontWeight: '700', color: colors.primary },
});
