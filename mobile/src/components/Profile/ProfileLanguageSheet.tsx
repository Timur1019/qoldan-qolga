import { Modal, Pressable, Text, View } from 'react-native';

import { useLanguage } from '@/context/LanguageContext';
import type { AppLanguage } from '@/i18n/types';

import { styles } from './ProfileLanguageSheet.styles';

export type { AppLanguage };

interface Props {
  visible: boolean;
  value: AppLanguage;
  onClose: () => void;
  onChange: (lang: AppLanguage) => void;
}

export function ProfileLanguageSheet({ visible, value, onClose, onChange }: Props) {
  const { t } = useLanguage();
  const options: { value: AppLanguage; label: string; flag: string }[] = [
    { value: 'uz', label: t('lang.uz'), flag: '🇺🇿' },
    { value: 'ru', label: t('lang.ru'), flag: '🇷🇺' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>{t('lang.title')}</Text>
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <Pressable
                key={opt.value}
                style={[styles.option, active && styles.optionOn]}
                onPress={() => {
                  onChange(opt.value);
                  onClose();
                }}
              >
                <Text style={styles.flag}>{opt.flag}</Text>
                <Text style={[styles.optionLabel, active && styles.optionLabelOn]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
