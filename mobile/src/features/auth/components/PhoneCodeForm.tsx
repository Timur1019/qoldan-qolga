import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';

import { styles } from './PhoneCodeForm.styles';

type Props = {
  phoneMasked: string;
  code: string;
  onCodeChange: (value: string) => void;
  onSubmit: () => void;
  onResend: () => void;
  onBack: () => void;
  resendAfter: number;
  submitting: boolean;
  error: string;
  debugCode?: string;
};

export function PhoneCodeForm({
  phoneMasked,
  code,
  onCodeChange,
  onSubmit,
  onResend,
  onBack,
  resendAfter,
  submitting,
  error,
  debugCode,
}: Props) {
  const { t } = useLanguage();

  return (
    <View style={styles.wrap}>
      <Text style={styles.hint}>
        {t('auth.codeSentTo')} <Text style={styles.strong}>{phoneMasked}</Text>
      </Text>
      {!!debugCode && (
        <Text style={styles.debug}>
          {t('auth.devCode')}: {debugCode}
        </Text>
      )}
      <Text style={styles.label}>{t('auth.code')}</Text>
      <TextInput
        style={styles.codeInput}
        value={code}
        onChangeText={(v) => onCodeChange(v.replace(/\D/g, '').slice(0, 8))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={8}
        autoFocus
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable
        style={[styles.button, code.length < 4 && styles.buttonDisabled]}
        onPress={onSubmit}
        disabled={submitting || code.length < 4}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>{t('auth.confirmCode')}</Text>
        )}
      </Pressable>
      <View style={styles.actions}>
        <Pressable onPress={onBack} disabled={submitting}>
          <Text style={styles.link}>{t('auth.changePhone')}</Text>
        </Pressable>
        <Pressable onPress={onResend} disabled={submitting || resendAfter > 0}>
          <Text style={[styles.link, resendAfter > 0 && styles.linkMuted]}>
            {resendAfter > 0 ? `${t('auth.resendIn')} ${resendAfter}s` : t('auth.resendCode')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
