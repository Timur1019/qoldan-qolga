import { type ReactNode } from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { styles } from './RefreshingList.styles';

type Props = {
  refreshing: boolean;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function RefreshingList({ refreshing, children, style }: Props) {
  return (
    <View style={[styles.wrap, refreshing && styles.refreshing, style]} pointerEvents={refreshing ? 'none' : 'auto'}>
      {children}
    </View>
  );
}
