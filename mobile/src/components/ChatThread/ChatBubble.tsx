import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Linking, Pressable, Text, View } from 'react-native';

import { imageUrl } from '@/api/client';
import { useLanguage } from '@/context/LanguageContext';
import type { MessageDto } from '@/types/api';
import { formatMessageTime } from '@/utils/chatFormat';

import { ChatMessageStatus } from './ChatMessageStatus';
import { styles } from './ChatBubble.styles';

interface Props {
  message: MessageDto;
  mine: boolean;
}

function isImageAttachment(message: MessageDto) {
  if (message.messageType === 'IMAGE') return true;
  return Boolean(message.attachmentUrl && /\.(jpg|jpeg|png|gif|webp)/i.test(message.attachmentUrl));
}

export function ChatBubble({ message, mine }: Props) {
  const { t } = useLanguage();
  const attachmentSrc = message.attachmentUrl ? imageUrl(message.attachmentUrl) : '';
  const showImage = Boolean(attachmentSrc) && isImageAttachment(message);

  return (
    <View style={[styles.row, mine ? styles.rowMine : styles.rowTheirs]}>
      <View style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}>
        {showImage ? (
          <Pressable onPress={() => void Linking.openURL(attachmentSrc)}>
            <Image source={{ uri: attachmentSrc }} style={styles.attachmentImage} contentFit="cover" />
          </Pressable>
        ) : null}
        {attachmentSrc && !showImage ? (
          <Pressable onPress={() => void Linking.openURL(attachmentSrc)}>
            <Text style={mine ? styles.fileLinkMine : styles.fileLink}>
              <Ionicons name="attach" size={14} /> {t('chat.downloadFile', 'Fayl')}
            </Text>
          </Pressable>
        ) : null}
        {message.text ? (
          <Text style={mine ? styles.textMine : styles.text}>{message.text}</Text>
        ) : null}
        <View style={styles.meta}>
          <Text style={[styles.time, mine ? styles.timeMine : undefined]}>
            {formatMessageTime(message.createdAt)}
          </Text>
          <ChatMessageStatus status={message.status} mine={mine} />
        </View>
      </View>
    </View>
  );
}
