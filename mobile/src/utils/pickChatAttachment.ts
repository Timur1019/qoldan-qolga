import * as ImagePicker from 'expo-image-picker';

export type ChatAttachmentPick = {
  uri: string;
  messageType: 'IMAGE' | 'FILE';
};

export async function pickChatImageFromLibrary(): Promise<ChatAttachmentPick | null> {
  const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!perm.granted) throw new Error('PERMISSION');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: false,
    quality: 0.85,
    selectionLimit: 1,
  });

  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return { uri: result.assets[0].uri, messageType: 'IMAGE' };
}

export async function pickChatImageFromCamera(): Promise<ChatAttachmentPick | null> {
  const perm = await ImagePicker.requestCameraPermissionsAsync();
  if (!perm.granted) throw new Error('PERMISSION');

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.85,
  });

  if (result.canceled || !result.assets?.[0]?.uri) return null;
  return { uri: result.assets[0].uri, messageType: 'IMAGE' };
}
