import { Pressable, Text, TextInput, View } from 'react-native';

import { OTP_LENGTH } from '@/features/auth/constants/otp';

import { styles } from './OtpBoxes.styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
  autoFocus?: boolean;
};

export function OtpBoxes({ value, onChange, autoFocus = true }: Props) {
  const digits = value.replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
  const activeIndex = Math.min(digits.length, OTP_LENGTH - 1);

  return (
    <Pressable style={styles.wrap}>
      <TextInput
        value={value.replace(/\D/g, '').slice(0, OTP_LENGTH)}
        onChangeText={(v) => onChange(v.replace(/\D/g, '').slice(0, OTP_LENGTH))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
        maxLength={OTP_LENGTH}
        autoFocus={autoFocus}
        caretHidden
        style={styles.hiddenInput}
        accessibilityLabel="SMS code"
      />
      <View style={styles.row} pointerEvents="none">
        {Array.from({ length: OTP_LENGTH }, (_, i) => {
          const filled = Boolean(digits[i]);
          const active = i === activeIndex;
          return (
            <View key={i} style={[styles.box, (filled || active) && styles.boxOn]}>
              {filled ? (
                <Text style={styles.digit}>{digits[i]}</Text>
              ) : active ? (
                <View style={styles.caret} />
              ) : null}
            </View>
          );
        })}
      </View>
    </Pressable>
  );
}
