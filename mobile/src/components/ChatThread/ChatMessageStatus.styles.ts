import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 2,
  },
  icon: {
    marginLeft: -5,
  },
  delivered: {
    color: 'rgba(255,255,255,0.72)',
  },
  read: {
    color: '#93c5fd',
  },
  deliveredTheirs: {
    color: colors.muted,
  },
});
