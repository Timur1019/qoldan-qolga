import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import { colors } from '@/theme/colors';
import { isPhotoAvatar } from '@/utils/isPhotoAvatar';
import { profileInitials } from '@/utils/profileDisplay';

import { styles } from './ProfileSettingsSheet.styles';

interface Props {
  visible: boolean;
  displayName: string;
  email?: string;
  avatar?: string | null;
  saving?: boolean;
  photoBusy?: boolean;
  message?: string;
  onClose: () => void;
  onChangeName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePhoto: () => void;
  onSave: () => void;
  onLogout: () => void;
}

export function ProfileSettingsSheet({
  visible,
  displayName,
  email,
  avatar,
  saving,
  photoBusy,
  message,
  onClose,
  onChangeName,
  onChangeEmail,
  onChangePhoto,
  onSave,
  onLogout,
}: Props) {
  const { t } = useLanguage();
  const [localName, setLocalName] = useState(displayName);
  const [localEmail, setLocalEmail] = useState(email || '');

  useEffect(() => {
    if (visible) {
      setLocalName(displayName);
      setLocalEmail(email || '');
    }
  }, [visible, displayName, email]);

  const showPhoto = isPhotoAvatar(avatar);
  const uri = showPhoto && avatar ? imageUrl(avatar) : '';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('profile.editProfile')}</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.close}>{t('common.close')}</Text>
            </Pressable>
          </View>

          <Pressable style={styles.avatarBlock} onPress={onChangePhoto} disabled={photoBusy}>
            <View style={styles.avatarWrap}>
              {uri ? (
                <Image source={{ uri }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitials}>{profileInitials(localName || 'U')}</Text>
                </View>
              )}
              <View style={styles.cameraBadge}>
                {photoBusy ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Ionicons name="camera" size={16} color={colors.white} />
                )}
              </View>
            </View>
            <Text style={styles.changePhoto}>{t('profile.changePhoto')}</Text>
          </Pressable>

          <Text style={styles.label}>{t('profile.editName')}</Text>
          <TextInput
            style={styles.input}
            value={localName}
            onChangeText={(v) => {
              setLocalName(v);
              onChangeName(v);
            }}
            placeholder={t('profile.editNamePlaceholder')}
            placeholderTextColor={colors.muted}
          />

          <Text style={styles.label}>{t('profile.editEmail')}</Text>
          <TextInput
            style={styles.input}
            value={localEmail}
            onChangeText={(v) => {
              setLocalEmail(v);
              onChangeEmail(v);
            }}
            placeholder="email@example.com"
            placeholderTextColor={colors.muted}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          {message ? <Text style={styles.message}>{message}</Text> : null}

          <Pressable style={styles.saveBtn} onPress={onSave} disabled={saving || photoBusy}>
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveBtnText}>{t('common.save')}</Text>
            )}
          </Pressable>

          <Pressable style={styles.logoutBtn} onPress={onLogout}>
            <Text style={styles.logoutText}>{t('settings.logout')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
