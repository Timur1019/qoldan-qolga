import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bgSubtle, padding: spacing.lg },
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
  textCol: { flex: 1, gap: 4 },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  sub: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  banner: {
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  bannerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bannerBtn: {
    marginTop: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bannerBtnText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  bannerLink: {
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  bannerLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
