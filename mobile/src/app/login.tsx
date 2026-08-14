import { router } from 'expo-router';
import { useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { PhoneAuthForm } from '@/features/auth/components/PhoneAuthForm';
import { PhoneCodeForm } from '@/features/auth/components/PhoneCodeForm';
import { usePhoneAuth } from '@/hooks/usePhoneAuth';
import { isValidUzPhone } from '@/utils/phoneFormat';

import { styles } from '@/features/auth/screens/LoginScreen.styles';

export default function LoginScreen() {
  const { setAuth } = useAuth();
  const { t } = useLanguage();
  const phoneAuth = usePhoneAuth();

  useEffect(() => {
    phoneAuth.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSend = async () => {
    phoneAuth.setError('');
    if (!isValidUzPhone(phoneAuth.phone) && phoneAuth.phone.replace(/\D/g, '').length !== 9) {
      phoneAuth.setError(t('auth.phoneInvalid'));
      return;
    }
    try {
      await phoneAuth.sendCode();
    } catch (e) {
      phoneAuth.setError(e instanceof Error ? e.message : t('auth.sendFailed'));
    }
  };

  const onVerify = async () => {
    phoneAuth.setError('');
    try {
      const res = await phoneAuth.verifyCode();
      await setAuth(res.token, {
        id: res.userId,
        email: res.email,
        phone: res.phone,
        displayName: res.displayName,
        role: res.role,
        avatar: res.avatar,
      });
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)/profile');
      }
    } catch (e) {
      phoneAuth.setError(e instanceof Error ? e.message : t('auth.codeInvalid'));
    }
  };

  const onResend = async () => {
    phoneAuth.setError('');
    try {
      await phoneAuth.resendCode();
    } catch (e) {
      phoneAuth.setError(e instanceof Error ? e.message : t('auth.sendFailed'));
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <Text style={styles.title}>{t('auth.phoneTitle')}</Text>
          {phoneAuth.step === 'phone' ? (
            <PhoneAuthForm
              phone={phoneAuth.phone}
              onPhoneChange={phoneAuth.setPhone}
              onSubmit={onSend}
              submitting={phoneAuth.submitting}
              error={phoneAuth.error}
            />
          ) : (
            <PhoneCodeForm
              phoneMasked={phoneAuth.phoneMasked}
              code={phoneAuth.code}
              onCodeChange={phoneAuth.setCode}
              onSubmit={onVerify}
              onResend={onResend}
              onBack={() => {
                phoneAuth.setStep('phone');
                phoneAuth.setError('');
              }}
              resendAfter={phoneAuth.resendAfter}
              submitting={phoneAuth.submitting}
              error={phoneAuth.error}
              debugCode={phoneAuth.debugCode}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
