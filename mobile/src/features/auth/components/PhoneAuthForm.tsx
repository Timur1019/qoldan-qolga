import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './PhoneAuthForm.styles';

type Props = {
  phone: string;
  onPhoneChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
  error: string;
};

export function PhoneAuthForm({ phone, onPhoneChange, onSubmit, submitting, error }: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>{t('auth.phoneHint')}</Text>
      <Text style={styles.label}>{t('auth.phone')}</Text>
      <View style={styles.phoneRow}>
        <Text style={styles.prefix}>+998</Text>
        <TextInput
          style={styles.phoneInput}
          value={phone}
          onChangeText={(v) => onPhoneChange(v.replace(/[^\d\s]/g, ''))}
          keyboardType="phone-pad"
          placeholder="90 123 45 67"
          placeholderTextColor="#9ca3af"
          maxLength={14}
          autoFocus
        />
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={onSubmit} disabled={submitting}>
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('auth.sendCode')}</Text>
        )}
      </Pressable>
    </View>
  );
}
