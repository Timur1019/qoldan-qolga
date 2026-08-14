import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  loader: { marginTop: 40 },
  list: { paddingBottom: 12 },
  emptyList: { flexGrow: 1 },
});
