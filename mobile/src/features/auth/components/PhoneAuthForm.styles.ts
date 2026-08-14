import { colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: { width: '100%' },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  prefix: {
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: colors.bgMuted,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 15,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.error, marginTop: 10, fontSize: 13 },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
