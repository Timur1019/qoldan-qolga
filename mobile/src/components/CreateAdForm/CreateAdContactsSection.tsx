import { Text, TextInput, View } from 'react-native';

import { colors } from '@/theme/colors';
import type { CreateAdFormState } from '@/utils/createAdForm';
import { styles } from '@/styles/screens/createAd.styles';

type Props = {
  form: CreateAdFormState;
  patch: (partial: Partial<CreateAdFormState>) => void;
  t: (key: string, fallback?: string) => string;
};

export function CreateAdContactsSection({ form, patch, t }: Props) {
  return (
    <>
      <View>
        <Text style={styles.label}>{t('create.phone')}</Text>
        <TextInput
          style={styles.input}
          value={form.phone}
          onChangeText={(phone) => patch({ phone })}
          keyboardType="phone-pad"
          placeholder="+998..."
          placeholderTextColor={colors.muted}
        />
      </View>
      <View>
        <Text style={styles.label}>{t('create.telegram')}</Text>
        <TextInput
          style={styles.input}
          value={form.telegramUsername}
          onChangeText={(telegramUsername) => patch({ telegramUsername })}
          placeholder="@username"
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
        />
      </View>
    </>
  );
}
