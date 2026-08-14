import { colors } from '@/theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  wrap: { width: '100%' },
  hint: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  strong: { color: colors.text, fontWeight: '600' },
  debug: {
    marginBottom: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#fff8e6',
    color: '#8a6d1d',
    fontSize: 13,
  },
  label: { fontSize: 13, color: colors.textSecondary, marginBottom: 6 },
  codeInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 22,
    letterSpacing: 8,
    textAlign: 'center',
    fontWeight: '700',
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
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: colors.white, fontWeight: '700', fontSize: 15 },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  link: { color: colors.primary, fontSize: 13, fontWeight: '600' },
  linkMuted: { color: colors.textSecondary, fontWeight: '500' },
});
