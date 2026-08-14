import { Text, View } from 'react-native';

import { styles } from './ChatThreadHeader.styles';

interface Props {
  title: string;
  subtitle?: string;
}

export function ChatThreadHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? (
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
