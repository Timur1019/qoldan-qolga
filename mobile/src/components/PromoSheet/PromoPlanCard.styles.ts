import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

export const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.bg,
    padding: spacing.md,
    gap: spacing.sm,
    position: 'relative',
    marginBottom: spacing.sm,
  },
  selected: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  featured: {
    backgroundColor: '#f3faf6',
    borderColor: 'rgba(4, 73, 45, 0.35)',
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  head: {
    paddingRight: 56,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  price: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  duration: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  features: {
    gap: 6,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  check: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  featureText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
  },
  cta: {
    marginTop: 4,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(4, 73, 45, 0.08)',
  },
  ctaSelected: {
    backgroundColor: colors.primary,
  },
  ctaText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  ctaTextSelected: {
    color: colors.white,
  },
});
