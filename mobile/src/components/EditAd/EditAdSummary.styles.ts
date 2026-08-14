import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  list: { gap: 1, backgroundColor: colors.border, borderRadius: radius.lg, overflow: 'hidden' },
  section: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: 8,
  },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '700', color: colors.text },
  change: { fontSize: 14, fontWeight: '600', color: colors.primary },
  line: { fontSize: 14, color: colors.text, lineHeight: 20 },
  lineMuted: { color: colors.textSecondary },
  photoRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  photo: { width: 64, height: 64, borderRadius: 10, backgroundColor: colors.bgMuted },
  deliverCard: {
    marginTop: spacing.md,
    backgroundColor: colors.bgMuted,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  deliverText: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text },
  footer: {
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    backgroundColor: colors.bg,
  },
  submit: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  error: { color: colors.error, marginBottom: 8, fontSize: 13 },
});
