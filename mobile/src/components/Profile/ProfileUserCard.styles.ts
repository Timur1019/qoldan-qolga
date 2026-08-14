import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: spacing.md,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.bgSubtle,
  },
  avatarHit: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.bgMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bgCard,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    maxWidth: '100%',
    paddingHorizontal: spacing.sm,
  },
  name: {
    flexShrink: 1,
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.2,
  },
  phone: {
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  storeBadge: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
  },
  publicLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  publicLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
