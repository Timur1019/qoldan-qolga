import { View } from 'react-native';

import { ProfileMenuRow, type ProfileMenuItem } from './ProfileMenuRow';
import { styles } from './ProfileMenuSection.styles';

interface Props {
  items: ProfileMenuItem[];
}

export function ProfileMenuSection({ items }: Props) {
  if (items.length === 0) return null;
  return (
    <View style={styles.card}>
      {items.map((item, index) => (
        <ProfileMenuRow key={item.key} item={item} isLast={index === items.length - 1} />
      ))}
    </View>
  );
}
